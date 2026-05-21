## no critic (Modules::RequireExplicitPackage Modules::RequireVersionVar Modules::ProhibitMultiplePackages Modules::RequireFilenameMatchesPackage Subroutines::ProhibitUnusedPrivateSubroutines RegularExpressions::RequireLineBoundaryMatching RegularExpressions::RequireDotMatchAnything RegularExpressions::RequireExtendedFormatting RegularExpressions::ProhibitCaptureWithoutTest ValuesAndExpressions::ProhibitMagicNumbers ValuesAndExpressions::ProhibitImplicitNewlines)
# Test-file exemptions (all standard test-code patterns, not bug risks):
#  - RequireExplicitPackage / RequireVersionVar: toplevel test code outside any package
#  - ProhibitMultiplePackages: inline test-subclass declarations
#  - ProhibitUnusedPrivateSubroutines: test subclasses override abstract
#    _query template methods (called polymorphically by the base)
#  - RequireLineBoundary / RequireDotMatchAnything / RequireExtendedFormatting:
#    `throws_ok` message matchers are short literal-substring patterns; /sxm adds noise
#  - ProhibitCaptureWithoutTest: $1 used after `return if !~` early-return — safe
#  - ProhibitMagicNumbers: integer literals in test assertions are self-documenting

use Modern::Perl;
use utf8;

use FindBin;
use File::Spec;

# The vendor ships .pm files at the repo root rather than in lib/, so map
# the Util:: namespace onto the on-disk layout for standalone testing.
# Consumers see the modules through the synced per-plugin namespace and
# don't need this shim.
my $vendor_root = File::Spec->rel2abs( File::Spec->catdir( $FindBin::Bin, q{..} ) );
unshift @INC, sub {
    my ( $coderef, $filename ) = @_;
    return if $filename !~ m{^Koha/Plugin/Com/LMSCloud/Util/(.+)\z};
    my $local = File::Spec->catfile( $vendor_root, $1 );
    return if !-e $local;
    open my $fh, '<:encoding(UTF-8)', $local or return;
    return $fh;
};

use Test::More;
use Test::Exception;
use DBI;

use_ok 'Koha::Plugin::Com::LMSCloud::Util::Reporting::Scope';
use_ok 'Koha::Plugin::Com::LMSCloud::Util::Reporting::Metric';
use_ok 'Koha::Plugin::Com::LMSCloud::Util::Reporting::Metric::Counter';
use_ok 'Koha::Plugin::Com::LMSCloud::Util::Reporting::Metric::TimeSeries';
use_ok 'Koha::Plugin::Com::LMSCloud::Util::Reporting::Metric::TopN';
use_ok 'Koha::Plugin::Com::LMSCloud::Util::Reporting::Metric::StackedBar';
use_ok 'Koha::Plugin::Com::LMSCloud::Util::Reporting::Metric::Heatmap';
use_ok 'Koha::Plugin::Com::LMSCloud::Util::Reporting::Dashboard';

subtest 'Scope validates ISO dates and ordering' => sub {
    my $scope = Koha::Plugin::Com::LMSCloud::Util::Reporting::Scope->new(
        start => '2026-01-01',
        end   => '2026-03-31',
    );
    is $scope->start,         '2026-01-01', 'start preserved';
    is $scope->end,           '2026-03-31', 'end preserved';
    is $scope->branchcode,    undef,        'branchcode defaults to undef';
    is $scope->categorycodes, undef,        'categorycodes defaults to undef';
    is $scope->roomids,       undef,        'roomids defaults to undef';
    is $scope->weekdays,      undef,        'weekdays defaults to undef';
    is $scope->hour_start,    undef,        'hour_start defaults to undef';
    is $scope->hour_end,      undef,        'hour_end defaults to undef';

    is_deeply $scope->as_hashref,
        {
        start         => '2026-01-01',
        end           => '2026-03-31',
        branchcode    => undef,
        categorycodes => undef,
        roomids       => undef,
        weekdays      => undef,
        hour_start    => undef,
        hour_end      => undef,
        },
        'as_hashref shape';

    throws_ok {
        Koha::Plugin::Com::LMSCloud::Util::Reporting::Scope->new(
            start => '01-01-2026',
            end   => '2026-03-31',
        );
    }
    qr/is not a valid ISO YYYY-MM-DD date/, 'rejects non-ISO start';

    throws_ok {
        Koha::Plugin::Com::LMSCloud::Util::Reporting::Scope->new(
            start => '2026-04-01',
            end   => '2026-03-31',
        );
    }
    qr/must be on or before end/, 'rejects inverted range';

    throws_ok {
        Koha::Plugin::Com::LMSCloud::Util::Reporting::Scope->new(
            start => '2026-13-40',
            end   => '2026-12-31',
        );
    }
    qr/is not a valid ISO YYYY-MM-DD date/, 'rejects out-of-range calendar values';
};

subtest 'Scope accepts multi-value filter lists' => sub {
    my $scope = Koha::Plugin::Com::LMSCloud::Util::Reporting::Scope->new(
        start         => '2026-01-01',
        end           => '2026-12-31',
        branchcode    => [ 'CPL', 'FFL' ],
        categorycodes => [ 'ST', 'PT' ],
        roomids       => [ 1, 2, 3 ],
        weekdays      => [ 0, 4 ],
        hour_start    => 8,
        hour_end      => 18,
    );
    is_deeply $scope->branchcode,    [ 'CPL', 'FFL' ], 'branchcode list propagated';
    is_deeply $scope->categorycodes, [ 'ST',  'PT' ],  'categorycodes propagated';
    is_deeply $scope->roomids,       [ 1, 2, 3 ],      'roomids propagated';
    is_deeply $scope->weekdays,      [ 0, 4 ],         'weekdays propagated';
    is $scope->hour_start, 8,  'hour_start propagated';
    is $scope->hour_end,   18, 'hour_end propagated';

    my $hashref = $scope->as_hashref;
    is_deeply $hashref->{branchcode},    [ 'CPL', 'FFL' ], 'as_hashref branchcode';
    is_deeply $hashref->{categorycodes}, [ 'ST',  'PT' ],  'as_hashref categorycodes';
    is_deeply $hashref->{roomids},       [ 1, 2, 3 ],      'as_hashref roomids';
    is_deeply $hashref->{weekdays},      [ 0, 4 ],         'as_hashref weekdays';
    is $hashref->{hour_start}, 8,  'as_hashref hour_start';
    is $hashref->{hour_end},   18, 'as_hashref hour_end';
};

subtest 'Scope coerces empty lists to undef' => sub {
    my $scope = Koha::Plugin::Com::LMSCloud::Util::Reporting::Scope->new(
        start         => '2026-01-01',
        end           => '2026-12-31',
        branchcode    => [],
        categorycodes => [],
        roomids       => [],
        weekdays      => [],
    );
    is $scope->branchcode,    undef, 'empty branchcode list normalised to undef';
    is $scope->categorycodes, undef, 'empty categorycodes list normalised to undef';
    is $scope->roomids,       undef, 'empty roomids list normalised to undef';
    is $scope->weekdays,      undef, 'empty weekdays list normalised to undef';
};

subtest 'Scope rejects malformed filter values' => sub {
    throws_ok {
        Koha::Plugin::Com::LMSCloud::Util::Reporting::Scope->new(
            start      => '2026-01-01',
            end        => '2026-12-31',
            branchcode => [ 'CPL', q{} ],
        );
    }
    qr/non-empty string/, 'rejects empty branchcode entry';

    throws_ok {
        Koha::Plugin::Com::LMSCloud::Util::Reporting::Scope->new(
            start    => '2026-01-01',
            end      => '2026-12-31',
            weekdays => [ 0, 7 ],
        );
    }
    qr/weekday .* must be 0\.\.6/, 'rejects out-of-range weekday';

    throws_ok {
        Koha::Plugin::Com::LMSCloud::Util::Reporting::Scope->new(
            start   => '2026-01-01',
            end     => '2026-12-31',
            roomids => [ 1, 0 ],
        );
    }
    qr/positive integer/, 'rejects non-positive roomid';

    throws_ok {
        Koha::Plugin::Com::LMSCloud::Util::Reporting::Scope->new(
            start      => '2026-01-01',
            end        => '2026-12-31',
            hour_start => 9,
        );
    }
    qr/both be set or both unset/, 'rejects half-set hour range';

    throws_ok {
        Koha::Plugin::Com::LMSCloud::Util::Reporting::Scope->new(
            start      => '2026-01-01',
            end        => '2026-12-31',
            hour_start => 0,
            hour_end   => 24,
        );
    }
    qr/hour .* must be 0\.\.23/, 'rejects hour > 23';

    throws_ok {
        Koha::Plugin::Com::LMSCloud::Util::Reporting::Scope->new(
            start      => '2026-01-01',
            end        => '2026-12-31',
            hour_start => 18,
            hour_end   => 9,
        );
    }
    qr/must be <= hour_end/, 'rejects inverted hour range';
};

# Seed a tiny in-memory schema used by every metric subtest below.
my $dbh = DBI->connect( 'dbi:SQLite:dbname=:memory:', q{}, q{}, { RaiseError => 1 } );
$dbh->do(<<'SQL');
CREATE TABLE bookings (
    booking_id   INTEGER PRIMARY KEY,
    start        TEXT NOT NULL,
    roomid       INTEGER NOT NULL,
    purpose      TEXT
);
SQL

my @seed = (
    [ '2026-01-05', 1, 'study' ],
    [ '2026-01-05', 1, 'study' ],
    [ '2026-01-06', 2, 'meeting' ],
    [ '2026-01-08', 1, 'tutoring' ],
    [ '2026-02-02', 3, 'meeting' ],
    [ '2026-02-02', 1, 'study' ],
    [ '2026-02-15', 2, 'meeting' ],
    [ '2026-03-10', 1, 'study' ],      # tips study (4) ahead of meeting (3)
    [ '2026-12-31', 1, 'study' ],      # outside scope below
);
my $ins = $dbh->prepare('INSERT INTO bookings (start, roomid, purpose) VALUES (?, ?, ?)');
$ins->execute( @{$_} ) for @seed;

my $scope = Koha::Plugin::Com::LMSCloud::Util::Reporting::Scope->new(
    start => '2026-01-01',
    end   => '2026-03-31',
);

# Inline test metric subclasses. These mirror what plugin authors would write.
{

    package TestCounter;
    use Moose;
    extends 'Koha::Plugin::Com::LMSCloud::Util::Reporting::Metric::Counter';
    has '+id'    => ( default => 'bookings_total' );
    has '+label' => ( default => 'Total bookings' );

    sub _query {
        my ($self) = @_;
        return ( 'SELECT COUNT(*) FROM bookings WHERE start BETWEEN ? AND ?', [ $self->scope->start, $self->scope->end ], );
    }
    __PACKAGE__->meta->make_immutable;
}

{

    package TestTimeSeries;
    use Moose;
    extends 'Koha::Plugin::Com::LMSCloud::Util::Reporting::Metric::TimeSeries';
    has '+id'    => ( default => 'bookings_over_time' );
    has '+label' => ( default => 'Bookings over time' );

    sub _query {
        my ($self) = @_;
        return (
            'SELECT start AS bucket, COUNT(*) AS value FROM bookings
              WHERE start BETWEEN ? AND ?
              GROUP BY start ORDER BY start',
            [ $self->scope->start, $self->scope->end ],
        );
    }
    __PACKAGE__->meta->make_immutable;
}

{

    package TestTopN;
    use Moose;
    extends 'Koha::Plugin::Com::LMSCloud::Util::Reporting::Metric::TopN';
    has '+id'    => ( default => 'top_purposes' );
    has '+label' => ( default => 'Top purposes' );

    sub _query {
        my ($self) = @_;
        return (
            'SELECT purpose AS label, COUNT(*) AS value FROM bookings
              WHERE start BETWEEN ? AND ?
              GROUP BY purpose ORDER BY value DESC, label LIMIT ?',
            [ $self->scope->start, $self->scope->end, $self->limit_n ],
        );
    }
    __PACKAGE__->meta->make_immutable;
}

subtest 'Counter primitive' => sub {
    my $metric   = TestCounter->new( dbh => $dbh, scope => $scope );
    my $envelope = $metric->compute;
    is $envelope->{id},          'bookings_total', 'envelope id';
    is $envelope->{type},        'counter',        'envelope type';
    is $envelope->{label},       'Total bookings', 'envelope label';
    is $envelope->{description}, q{},              'description always present (empty string default)';
    is $envelope->{value},       8,                'counts rows within scope only';
};

subtest 'TimeSeries primitive' => sub {
    my $metric   = TestTimeSeries->new( dbh => $dbh, scope => $scope, bucket => 'day' );
    my $envelope = $metric->compute;
    is $envelope->{type},               'time_series', 'envelope type';
    is $envelope->{bucket},             'day',         'bucket echoed';
    is scalar @{ $envelope->{series} }, 6,             'one row per distinct day in scope';
    is_deeply $envelope->{series}->[0], { bucket => '2026-01-05', value => 2 }, 'first bucket aggregated correctly';
    is $envelope->{series}->[-1]->{bucket}, '2026-03-10', 'last bucket within scope';
};

subtest 'TimeSeries bucket_expression helper emits MariaDB syntax' => sub {
    my %expected = (
        day   => 'DATE(start)',
        week  => q{DATE_FORMAT(start, '%x-W%v')},
        month => q{DATE_FORMAT(start, '%Y-%m')},
    );
    for my $bucket ( sort keys %expected ) {
        my $metric = TestTimeSeries->new( dbh => $dbh, scope => $scope, bucket => $bucket );
        is $metric->bucket_expression('start'), $expected{$bucket}, "bucket=$bucket";
    }
};

subtest 'TopN primitive' => sub {
    my $metric   = TestTopN->new( dbh => $dbh, scope => $scope );
    my $envelope = $metric->compute;
    is $envelope->{type}, 'top_n', 'envelope type';
    my $items = $envelope->{items};
    is scalar @{$items}, 3, 'three distinct purposes in scope';
    is_deeply $items->[0], { label => 'study',    value => 4 }, 'top row';
    is_deeply $items->[1], { label => 'meeting',  value => 3 }, 'second row';
    is_deeply $items->[2], { label => 'tutoring', value => 1 }, 'third row';
};

{

    package TestTopNNoLimit;
    use Moose;
    extends 'Koha::Plugin::Com::LMSCloud::Util::Reporting::Metric::TopN';
    has '+id'    => ( default => 'no_limit' );
    has '+label' => ( default => 'No limit' );

    sub _query {
        my ($self) = @_;
        return ( 'SELECT purpose AS label, COUNT(*) AS value FROM bookings GROUP BY purpose', [], );
    }
    __PACKAGE__->meta->make_immutable;
}

subtest 'TopN rejects SQL without a LIMIT clause' => sub {
    my $metric = TestTopNNoLimit->new( dbh => $dbh, scope => $scope );
    throws_ok { $metric->compute } qr/LIMIT clause/, 'missing LIMIT croaks';
};

subtest 'StackedBar primitive shapes buckets and series' => sub {
    my $local_dbh = DBI->connect( 'dbi:SQLite:dbname=:memory:', q{}, q{}, { RaiseError => 1 } );
    $local_dbh->do(<<'SQL');
CREATE TABLE bookings (
    booking_id INTEGER PRIMARY KEY,
    bucket TEXT, bucket_order INTEGER,
    room TEXT, room_color TEXT, room_order INTEGER
);
SQL

    # Two weekday buckets x three rooms, with one room absent on one bucket.
    my @seed = (
        [ 'Mon', 0, 'R1', '#aaaaaa', 1, 1 ],
        [ 'Mon', 0, 'R2', '#bbbbbb', 2, 1 ],
        [ 'Mon', 0, 'R3', '#cccccc', 3, 1 ],
        [ 'Tue', 1, 'R1', '#aaaaaa', 1, 1 ],
        [ 'Tue', 1, 'R2', '#bbbbbb', 2, 1 ],

        # R1 dominates on Mon, R2 on Tue.
        [ 'Mon', 0, 'R1', '#aaaaaa', 1, 4 ],
        [ 'Tue', 1, 'R2', '#bbbbbb', 2, 3 ],
    );
    my $ins = $local_dbh->prepare('INSERT INTO bookings (bucket,bucket_order,room,room_color,room_order) VALUES (?,?,?,?,?)');
    for my $row (@seed) {
        my ( $b, $bo, $r, $rc, $ro, $reps ) = @{$row};
        for ( 1 .. $reps ) { $ins->execute( $b, $bo, $r, $rc, $ro ) }
    }

    {

        package TestStackedBar;
        use Moose;
        extends 'Koha::Plugin::Com::LMSCloud::Util::Reporting::Metric::StackedBar';
        has '+id'    => ( default => 'bookings_by_weekday' );
        has '+label' => ( default => 'Bookings by weekday' );

        sub _query {
            return (
                'SELECT bucket, bucket_order, room AS series_label, room_color AS series_color,
                        room_order AS series_order, COUNT(*) AS value
                 FROM bookings GROUP BY bucket, bucket_order, room, room_color, room_order',
                [],
            );
        }
        __PACKAGE__->meta->make_immutable;
    }

    my $metric   = TestStackedBar->new( dbh => $local_dbh, scope => $scope );
    my $envelope = $metric->compute;
    is $envelope->{type}, 'stacked_bar', 'envelope type';
    is_deeply $envelope->{buckets}, [ 'Mon', 'Tue' ], 'buckets ordered by bucket_order';

    my %series_by_label = map { $_->{label} => $_ } @{ $envelope->{series} };
    is_deeply $series_by_label{R1}->{values}, [ 5, 1 ], 'R1 values across buckets (zero-fill not needed)';
    is_deeply $series_by_label{R2}->{values}, [ 1, 4 ], 'R2 values';
    is_deeply $series_by_label{R3}->{values}, [ 1, 0 ], 'R3 zero-filled on Tue';
    is $series_by_label{R1}->{color}, '#aaaaaa', 'series color carried through';
};

subtest 'StackedBar caps to top_n_series with Other bucket' => sub {
    my $local_dbh = DBI->connect( 'dbi:SQLite:dbname=:memory:', q{}, q{}, { RaiseError => 1 } );
    $local_dbh->do('CREATE TABLE b (bucket TEXT, bucket_order INTEGER, s TEXT, sc TEXT, so INTEGER, v INTEGER)');
    my $ins = $local_dbh->prepare('INSERT INTO b VALUES (?,?,?,?,?,?)');

    # 5 series with descending totals. Cap at 2 -> S1, S2 kept; S3+S4+S5 -> Other.
    $ins->execute( 'X', 0, 'S1', '#111', 1, 10 );
    $ins->execute( 'X', 0, 'S2', '#222', 2, 7 );
    $ins->execute( 'X', 0, 'S3', '#333', 3, 3 );
    $ins->execute( 'X', 0, 'S4', '#444', 4, 2 );
    $ins->execute( 'X', 0, 'S5', '#555', 5, 1 );

    {

        package TestStackedCap;
        use Moose;
        extends 'Koha::Plugin::Com::LMSCloud::Util::Reporting::Metric::StackedBar';
        has '+id'           => ( default => 'capped' );
        has '+label'        => ( default => 'Capped' );
        has '+top_n_series' => ( default => 2 );

        sub _query {
            return ( 'SELECT bucket, bucket_order, s AS series_label, sc AS series_color,
                            so AS series_order, v AS value FROM b', [] );
        }
        __PACKAGE__->meta->make_immutable;
    }

    my $metric   = TestStackedCap->new( dbh => $local_dbh, scope => $scope );
    my $envelope = $metric->compute;
    is scalar @{ $envelope->{series} }, 3, 'top 2 + Other = 3 series';
    is $envelope->{series}->[0]->{label}, 'S1',    'biggest series first';
    is $envelope->{series}->[1]->{label}, 'S2',    'second biggest second';
    is $envelope->{series}->[2]->{label}, 'Other', 'Other bucket appended';
    is_deeply $envelope->{series}->[2]->{values}, [ 6 ], 'Other sums collapsed series (3+2+1)';
};

subtest 'Heatmap primitive shapes rows, cols, grid' => sub {
    my $local_dbh = DBI->connect( 'dbi:SQLite:dbname=:memory:', q{}, q{}, { RaiseError => 1 } );
    $local_dbh->do('CREATE TABLE b (rl TEXT, ro INTEGER, cl TEXT, cc TEXT, co INTEGER, v INTEGER)');
    my $ins = $local_dbh->prepare('INSERT INTO b VALUES (?,?,?,?,?,?)');

    # Two patron categories x three rooms, with one cell absent.
    $ins->execute( 'Staff',   1, 'R1', '#aaa', 1, 5 );
    $ins->execute( 'Staff',   1, 'R2', '#bbb', 2, 3 );
    $ins->execute( 'Staff',   1, 'R3', '#ccc', 3, 1 );
    $ins->execute( 'Student', 2, 'R1', '#aaa', 1, 7 );
    $ins->execute( 'Student', 2, 'R3', '#ccc', 3, 2 );

    {

        package TestHeatmap;
        use Moose;
        extends 'Koha::Plugin::Com::LMSCloud::Util::Reporting::Metric::Heatmap';
        has '+id'    => ( default => 'category_room' );
        has '+label' => ( default => 'Category x Room' );

        sub _query {
            return (
                'SELECT rl AS row_label, ro AS row_order,
                        cl AS col_label, cc AS col_color, co AS col_order,
                        v AS value FROM b',
                [],
            );
        }
        __PACKAGE__->meta->make_immutable;
    }

    my $metric   = TestHeatmap->new( dbh => $local_dbh, scope => $scope );
    my $envelope = $metric->compute;
    is $envelope->{type}, 'heatmap', 'envelope type';
    is_deeply [ map { $_->{label} } @{ $envelope->{rows} } ], [ 'Staff', 'Student' ], 'rows ordered';
    is_deeply [ map { $_->{label} } @{ $envelope->{cols} } ], [ 'R1', 'R2', 'R3' ],   'cols ordered';
    is $envelope->{cols}->[0]->{color}, '#aaa', 'col color carried through';
    is_deeply $envelope->{grid}, [ [ 5, 3, 1 ], [ 7, 0, 2 ] ], 'grid zero-fills missing cells';
};

subtest 'Dashboard envelope and validation' => sub {
    my $dashboard = Koha::Plugin::Com::LMSCloud::Util::Reporting::Dashboard->new(
        scope   => $scope,
        metrics => [
            TestCounter->new( dbh => $dbh, scope => $scope ),
            TestTimeSeries->new( dbh => $dbh, scope => $scope, bucket => 'day' ),
            TestTopN->new( dbh => $dbh, scope => $scope ),
        ],
    );
    my $payload = $dashboard->serialize;
    is_deeply $payload->{scope}, $scope->as_hashref, 'scope echoed';
    is scalar @{ $payload->{metrics} },  3,             'three metrics serialized';
    is $payload->{metrics}->[0]->{type}, 'counter',     'metric 0 type';
    is $payload->{metrics}->[1]->{type}, 'time_series', 'metric 1 type';
    is $payload->{metrics}->[2]->{type}, 'top_n',       'metric 2 type';

    throws_ok {
        Koha::Plugin::Com::LMSCloud::Util::Reporting::Dashboard->new(
            scope   => $scope,
            metrics => [],
        );
    }
    qr/metrics list is empty/, 'empty metrics rejected';

    throws_ok {
        Koha::Plugin::Com::LMSCloud::Util::Reporting::Dashboard->new(
            scope   => $scope,
            metrics => [ TestCounter->new( dbh => $dbh, scope => $scope ), TestCounter->new( dbh => $dbh, scope => $scope ), ],
        );
    }
    qr/duplicate metric id/, 'duplicate ids rejected';

    throws_ok {
        Koha::Plugin::Com::LMSCloud::Util::Reporting::Dashboard->new(
            scope   => $scope,
            metrics => [ bless {}, 'NotAMetric' ],
        );
    }
    qr/Reporting::Metric instance/, 'non-Metric rejected';
};

done_testing;

1;
