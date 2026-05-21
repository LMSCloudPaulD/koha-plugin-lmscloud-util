package Koha::Plugin::Com::LMSCloud::Util::Reporting::Scope;

use Modern::Perl;
use utf8;

use Carp qw( croak );
use Moose;
use Readonly    qw( Readonly );
use Time::Piece ();
use Try::Tiny   qw( catch try );

our $VERSION = '1.1.0';

Readonly my $WEEKDAY_MIN => 0;
Readonly my $WEEKDAY_MAX => 6;
Readonly my $HOUR_MIN    => 0;
Readonly my $HOUR_MAX    => 23;

has 'start' => (
    is       => 'ro',
    isa      => 'Str',
    required => 1,
);

has 'end' => (
    is       => 'ro',
    isa      => 'Str',
    required => 1,
);

has 'branchcode' => (
    is      => 'ro',
    isa     => 'Maybe[ArrayRef[Str]]',
    default => undef,
);

has 'categorycodes' => (
    is      => 'ro',
    isa     => 'Maybe[ArrayRef[Str]]',
    default => undef,
);

has 'roomids' => (
    is      => 'ro',
    isa     => 'Maybe[ArrayRef[Int]]',
    default => undef,
);

# MySQL WEEKDAY() semantics: 0 = Monday … 6 = Sunday.
has 'weekdays' => (
    is      => 'ro',
    isa     => 'Maybe[ArrayRef[Int]]',
    default => undef,
);

has 'hour_start' => (
    is      => 'ro',
    isa     => 'Maybe[Int]',
    default => undef,
);

has 'hour_end' => (
    is      => 'ro',
    isa     => 'Maybe[Int]',
    default => undef,
);

sub BUILD {
    my ($self) = @_;

    for my $field (qw( start end )) {
        _validate_iso_date( $field, $self->$field );
    }

    croak 'Reporting::Scope: start (' . $self->start . ') must be on or before end (' . $self->end . ')'
        if $self->start gt $self->end;

    for my $field (qw( branchcode categorycodes roomids weekdays )) {
        $self->{$field} = _normalize_list( $self->{$field} );
    }

    for my $field (qw( branchcode categorycodes )) {
        next if !defined $self->{$field};
        for my $code ( @{ $self->{$field} } ) {
            croak "Reporting::Scope: $field entry must be a non-empty string"
                if !defined $code || $code eq q{};
        }
    }

    if ( defined $self->{weekdays} ) {
        for my $wd ( @{ $self->{weekdays} } ) {
            croak "Reporting::Scope: weekday ('$wd') must be $WEEKDAY_MIN..$WEEKDAY_MAX (MySQL WEEKDAY semantics: 0=Mon, 6=Sun)"
                if $wd < $WEEKDAY_MIN || $wd > $WEEKDAY_MAX;
        }
    }

    if ( defined $self->{roomids} ) {
        for my $rid ( @{ $self->{roomids} } ) {
            croak "Reporting::Scope: roomid ('$rid') must be a positive integer"
                if $rid < 1;
        }
    }

    _validate_hour_range( $self->{hour_start}, $self->{hour_end} );

    return;
}

sub _validate_iso_date {
    my ( $field, $value ) = @_;

    my $ok = try {
        Time::Piece->strptime( $value, '%Y-%m-%d' );
        return 1;
    }
    catch {
        return 0;
    };

    return if $ok;
    croak "Reporting::Scope: $field ('$value') is not a valid ISO YYYY-MM-DD date";
}

# Empty list is semantically equivalent to "no filter" — coerce to undef so
# consumers can branch on `defined $scope->roomids` without checking length.
sub _normalize_list {
    my ($value) = @_;
    return if !defined $value;
    return if !@{$value};
    return $value;
}

sub _validate_hour_range {
    my ( $start, $end ) = @_;

    my $start_set = defined $start;
    my $end_set   = defined $end;

    return if !$start_set && !$end_set;

    croak 'Reporting::Scope: hour_start and hour_end must both be set or both unset'
        if $start_set xor $end_set;

    for my $h ( $start, $end ) {
        croak "Reporting::Scope: hour ('$h') must be $HOUR_MIN..$HOUR_MAX"
            if $h < $HOUR_MIN || $h > $HOUR_MAX;
    }

    croak "Reporting::Scope: hour_start ($start) must be <= hour_end ($end)"
        if $start > $end;

    return;
}

sub as_hashref {
    my ($self) = @_;
    return {
        start         => $self->start,
        end           => $self->end,
        branchcode    => $self->branchcode,
        categorycodes => $self->categorycodes,
        roomids       => $self->roomids,
        weekdays      => $self->weekdays,
        hour_start    => $self->hour_start,
        hour_end      => $self->hour_end,
    };
}

__PACKAGE__->meta->make_immutable;

1;
