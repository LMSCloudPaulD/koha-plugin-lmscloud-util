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
use_ok 'Koha::Plugin::Com::LMSCloud::Util::Reporting::Dashboard';

subtest 'Scope validates ISO dates and ordering' => sub {
    my $scope = Koha::Plugin::Com::LMSCloud::Util::Reporting::Scope->new(
        start => '2026-01-01',
        end   => '2026-03-31',
    );
    is $scope->start,      '2026-01-01', 'start preserved';
    is $scope->end,        '2026-03-31', 'end preserved';
    is $scope->branchcode, undef,        'branchcode defaults to undef';

    is_deeply $scope->as_hashref, { start => '2026-01-01', end => '2026-03-31', branchcode => undef }, 'as_hashref shape';

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

    my $with_branch = Koha::Plugin::Com::LMSCloud::Util::Reporting::Scope->new(
        start      => '2026-01-01',
        end        => '2026-12-31',
        branchcode => 'CPL',
    );
    is $with_branch->branchcode, 'CPL', 'branchcode propagated';
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
