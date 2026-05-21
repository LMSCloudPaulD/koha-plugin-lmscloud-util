package Koha::Plugin::Com::LMSCloud::Util::Reporting::Metric::Heatmap;

use Modern::Perl;
use utf8;

use Moose;

use Koha::Plugin::Com::LMSCloud::Util::Reporting::Types qw( $HEATMAP );

extends 'Koha::Plugin::Com::LMSCloud::Util::Reporting::Metric';

our $VERSION = '1.0.0';

sub type { return $HEATMAP }

## no critic qw(Subroutines::ProhibitUnusedPrivateSubroutines)
# Template method invoked by base compute().
#
# Author SQL must return rows shaped as:
#   row_label   - label for the y-axis (e.g. patron-category description)
#   row_order   - integer used to order rows stably
#   col_label   - label for the x-axis (e.g. room name)
#   col_color   - optional CSS color string carried through to the column header
#   col_order   - integer used to order columns stably (e.g. roomid)
#   value       - aggregate count for this (row, col) cell
#
# The post-processor reshapes those rows into the wire envelope:
#   { rows: [{label}], cols: [{label, color}], grid: [[value, ...], ...] }
# with rows ordered by row_order, cols ordered by col_order, and grid
# zero-filled where the underlying SQL produced no row.
sub _postprocess {
    my ( $self, $sth ) = @_;

    my $rows = $self->_coerce_rows( $sth, [qw( row_label row_order col_label col_color col_order value )], );

    my ( $row_axis, $col_axis, $grid ) = _grid_from_rows($rows);

    return {
        rows => [ map { { label => $_->{label} } } @{$row_axis} ],
        cols => [ map { { label => $_->{label}, color => $_->{color}, } } @{$col_axis} ],
        grid => $grid,
    };
}
## use critic

sub _grid_from_rows {
    my ($rows) = @_;

    my %row_index;
    my @row_axis;
    my %col_index;
    my @col_axis;
    my %cells;

    for my $row ( @{$rows} ) {
        my $rlabel = $row->{row_label};
        if ( !exists $row_index{$rlabel} ) {
            $row_index{$rlabel} = scalar @row_axis;
            push @row_axis, { label => $rlabel, order => $row->{row_order} + 0 };
        }
        my $clabel = $row->{col_label};
        if ( !exists $col_index{$clabel} ) {
            $col_index{$clabel} = scalar @col_axis;
            push @col_axis,
                {
                label => $clabel,
                color => $row->{col_color},
                order => $row->{col_order} + 0,
                };
        }
        $cells{"$rlabel\0$clabel"} = $row->{value} + 0;
    }

    @row_axis = sort { $a->{order} <=> $b->{order} } @row_axis;
    @col_axis = sort { $a->{order} <=> $b->{order} } @col_axis;

    my @grid;
    for my $r (@row_axis) {
        my @cells_row;
        for my $c (@col_axis) {
            push @cells_row, $cells{"$r->{label}\0$c->{label}"} // 0;
        }
        push @grid, \@cells_row;
    }

    return ( \@row_axis, \@col_axis, \@grid );
}

__PACKAGE__->meta->make_immutable;

1;
