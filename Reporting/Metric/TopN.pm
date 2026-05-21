package Koha::Plugin::Com::LMSCloud::Util::Reporting::Metric::TopN;

use Modern::Perl;
use utf8;

use Carp qw( croak );
use Moose;
use Moose::Util::TypeConstraints qw( enum );

use Koha::Plugin::Com::LMSCloud::Util::Reporting::Types qw( $TOP_N );

extends 'Koha::Plugin::Com::LMSCloud::Util::Reporting::Metric';

our $VERSION = '1.0.0';

has 'limit_n' => (
    is      => 'ro',
    isa     => 'Int',
    default => 10,
);

# 'horizontal' renders the values on the x-axis (default; reads as a
# ranked list); 'vertical' renders categories on the x-axis (reads as a
# histogram, useful when the categories are temporal — hour-of-day,
# weekday — and should flow left-to-right). Only consulted by the
# frontend when `display` is "bar".
has 'orientation' => (
    is      => 'ro',
    isa     => enum( [qw( horizontal vertical )] ),
    default => 'horizontal',
);

# 'bar' renders the items as a Chart.js bar chart (default; ranked or
# histogram per `orientation`). 'donut' renders them as a doughnut chart
# — better for proportional "share of total" reads where exact ranking
# matters less than relative slice size.
has 'display' => (
    is      => 'ro',
    isa     => enum( [qw( bar donut )] ),
    default => 'bar',
);

sub type { return $TOP_N }

## no critic qw(Subroutines::ProhibitUnusedPrivateSubroutines ValuesAndExpressions::RequireInterpolationOfMetachars)
# Template method invoked by base compute(); the LIMIT-guard message
# carries literal `$self->limit_n` text as documentation, not interpolation.
sub _postprocess {
    my ( $self, $sth ) = @_;

    # The author's SQL must carry its own LIMIT (using $self->limit_n as
    # the bind value) because we can't rewrite arbitrary user SQL safely.
    # We check here so the failure mode is a clear croak rather than a
    # silent OOM on big tables.
    my $sql = $sth->{Statement} // q{};
    croak 'Reporting::Metric::TopN: SQL must include a LIMIT clause (use $self->limit_n as the bind value)'
        if $sql !~ m{\bLIMIT\b}smxi;

    my $items = $self->_coerce_rows( $sth, [qw( label value )] );
    return {
        items       => $items,
        orientation => $self->orientation,
        display     => $self->display,
    };
}
## use critic

__PACKAGE__->meta->make_immutable;

1;
