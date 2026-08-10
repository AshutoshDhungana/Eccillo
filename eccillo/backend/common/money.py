from dataclasses import dataclass
from decimal import Decimal


@dataclass(frozen=True)
class Money:
    """amount_minor is in the smallest currency unit (paisa for NPR, cents for USD)."""
    amount_minor: int
    currency: str = "NPR"

    def to_display(self) -> Decimal:
        return Decimal(self.amount_minor) / 100

    def __str__(self) -> str:
        return f"{self.currency} {self.to_display():,.2f}"

    def __add__(self, other: "Money") -> "Money":
        assert self.currency == other.currency, "Currency mismatch"
        return Money(self.amount_minor + other.amount_minor, self.currency)

    def __sub__(self, other: "Money") -> "Money":
        assert self.currency == other.currency, "Currency mismatch"
        return Money(self.amount_minor - other.amount_minor, self.currency)
