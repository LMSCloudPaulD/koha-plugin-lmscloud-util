package Koha::Plugin::Com::LMSCloud::Util::Reporting::Metric::StackedBar;

use Modern::Perl;
use utf8;

use Moose;

use Koha::Plugin::Com::LMSCloud::Util::Reporting::Types qw( $STACKED_BAR );

extends 'Koha::Plugin::Com::LMSCloud::Util::Reporting::Metric';

our $VERSION = '1.0.0';

# Cap on the number of distinct series shown as their own bar segment.
# Series outside the top N are collapsed into the `other_label` bucket so
# the legend stays scannable for libraries with many rooms / categories.
# Set to 0 to disable the cap.
has 'top_n_series' => (
    is      => 'ro',
    isa     => 'Int',
    default => 8,
);

has 'other_label' => (
    is      => 'ro',
    isa     => 'Str',
    default => 'Other',
);

has 'other_color' => (
    is      => 'ro',
    isa     => 'Str',
    default => '#999999',
);

sub type { return $STACKED_BAR }

## no critic qw(Subroutines::ProhibitUnusedPrivateSubroutines)
# Template method invoked by base compute().
#
# Author SQL must return rows shaped as:
#   bucket        - display label for the x-axis category (e.g. "Monday")
#   bucket_order  - integer used to order buckets stably (e.g. WEEKDAY())
#   series_label  - display label for the legend entry (e.g. room name)
#   series_color  - optional CSS color string for the segment (NULL allowed)
#   series_order  - integer used to order series within a bucket (e.g. roomid)
#   value         - aggregate count for this (bucket, series) cell
#
# The post-processor reshapes those rows into the wire envelope:
#   { buckets: [...], series: [{ label, color, values: [...] }] }
# with values arrays the same length as buckets (zero-filled where absent),
# and applies the top-N + Other cap by total descending.
sub _postprocess {
    my ( $self, $sth ) = @_;

    my $rows = $self->_coerce_rows( $sth, [qw( bucket bucket_order series_label series_color series_order value )], );

    my ( $buckets, $series ) = _bucketise($rows);
    $series = $self->_cap_series($series);

    return {
        buckets => [ map { $_->{label} } @{$buckets} ],
        series  => [ map { { label => $_->{label}, color => $_->{color}, values => $_->{values}, } } @{$series} ],
    };
}
## use critic

sub _bucketise {
    my ($rows) = @_;

    my %bucket_index;
    my @buckets;
    my %series_by_label;
    my @series;

    for my $row ( @{$rows} ) {
        my $blabel = $row->{bucket};
        if ( !exists $bucket_index{$blabel} ) {
            $bucket_index{$blabel} = scalar @buckets;
            push @buckets, { label => $blabel, order => $row->{bucket_order} + 0 };
        }
        my $slabel = $row->{series_label};
        if ( !exists $series_by_label{$slabel} ) {
            $series_by_label{$slabel} = {
                label  => $slabel,
                color  => $row->{series_color},
                order  => $row->{series_order} + 0,
                values => {},
                total  => 0,
            };
            push @series, $series_by_label{$slabel};
        }
        my $value = $row->{value} + 0;
        $series_by_label{$slabel}->{values}->{$blabel} = $value;
        $series_by_label{$slabel}->{total} += $value;
    }

    # Stable order on both axes — bucket_order/series_order are integer
    # sort keys assigned by the author SQL (e.g. WEEKDAY(), roomid).
    @buckets = sort { $a->{order} <=> $b->{order} } @buckets;

    # Materialise each series's values array against the final bucket order.
    for my $s (@series) {
        my @vals = map { $s->{values}->{ $_->{label} } // 0 } @buckets;
        $s->{values} = \@vals;
    }

    return ( \@buckets, \@series );
}

sub _cap_series {
    my ( $self, $series ) = @_;

    my $cap = $self->top_n_series;
    return $series if $cap <= 0 || scalar @{$series} <= $cap;

    my @sorted = reverse sort { $a->{total} <=> $b->{total} } @{$series};
    my @kept   = @sorted[ 0 .. $cap - 1 ];
    my @tail   = @sorted[ $cap .. $#sorted ];

    my @other_values;
    for my $s (@tail) {
        my @vals = @{ $s->{values} };
        for my $i ( 0 .. $#vals ) {
            $other_values[$i] = ( $other_values[$i] // 0 ) + $vals[$i];
        }
    }

    push @kept,
        {
        label  => $self->other_label,
        color  => $self->other_color,
        values => \@other_values,
        };

    return \@kept;
}

__PACKAGE__->meta->make_immutable;

1;
