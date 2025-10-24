import { Listing, Category, User } from "../app/types";

// Validation utilities for the application

export class ValidationUtils {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhone(phone: string): boolean {
    // Simple Lithuanian phone number validation
    const phoneRegex = /^(\+370|370|8)?[0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  }

  static validatePrice(price: string): { valid: boolean; error?: string } {
    if (!price.trim()) {
      return { valid: false, error: "Kaina yra privaloma" };
    }

    const numPrice = Number(price);
    if (isNaN(numPrice)) {
      return { valid: false, error: "Kaina turi būti skaičius" };
    }

    if (numPrice <= 0) {
      return { valid: false, error: "Kaina turi būti teigiama" };
    }

    if (numPrice > 1000000) {
      return { valid: false, error: "Kaina negali viršyti 1,000,000 €" };
    }

    return { valid: true };
  }

  static validateListingTitle(title: string): {
    valid: boolean;
    error?: string;
  } {
    if (!title.trim()) {
      return { valid: false, error: "Pavadinimas yra privalomas" };
    }

    if (title.length < 3) {
      return { valid: false, error: "Pavadinimas turi būti bent 3 simbolių" };
    }

    if (title.length > 100) {
      return { valid: false, error: "Pavadinimas negali viršyti 100 simbolių" };
    }

    return { valid: true };
  }

  static validateDescription(description: string): {
    valid: boolean;
    error?: string;
  } {
    if (!description.trim()) {
      return { valid: false, error: "Aprašymas yra privalomas" };
    }

    if (description.length < 10) {
      return { valid: false, error: "Aprašymas turi būti bent 10 simbolių" };
    }

    if (description.length > 1000) {
      return { valid: false, error: "Aprašymas negali viršyti 1000 simbolių" };
    }

    return { valid: true };
  }

  static validateListing(listing: Partial<Listing>): {
    valid: boolean;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {};

    // Validate title
    const titleResult = this.validateListingTitle(listing.title || "");
    if (!titleResult.valid) {
      errors.title = titleResult.error!;
    }

    // Validate description
    const descResult = this.validateDescription(listing.description || "");
    if (!descResult.valid) {
      errors.description = descResult.error!;
    }

    // Validate price
    const priceResult = this.validatePrice(listing.price?.toString() || "");
    if (!priceResult.valid) {
      errors.price = priceResult.error!;
    }

    // Validate contact info
    if (!listing.contact?.name?.trim()) {
      errors.contactName = "Kontaktinis vardas yra privalomas";
    }

    if (!listing.contact?.email || !this.validateEmail(listing.contact.email)) {
      errors.contactEmail = "Neteisingas el. pašto formatas";
    }

    if (!listing.contact?.phone || !this.validatePhone(listing.contact.phone)) {
      errors.contactPhone = "Neteisingas telefono numerio formatas";
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static validateUser(user: Partial<User>): {
    valid: boolean;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {};

    if (!user.name?.trim()) {
      errors.name = "Vardas yra privalomas";
    } else if (user.name.length < 2) {
      errors.name = "Vardas turi būti bent 2 simbolių";
    }

    if (!user.email || !this.validateEmail(user.email)) {
      errors.email = "Neteisingas el. pašto formatas";
    }

    if (!user.phone || !this.validatePhone(user.phone)) {
      errors.phone = "Neteisingas telefono numerio formatas";
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, "");
  }

  static formatPrice(price: number): string {
    return new Intl.NumberFormat("lt-LT", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  static formatDate(date: Date): string {
    return new Intl.DateTimeFormat("lt-LT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  }

  static getTimeAgo(date: Date | string): string {
    const now = new Date();
    const targetDate = typeof date === "string" ? new Date(date) : date;
    const diffTime = Math.abs(now.getTime() - targetDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Šiandien";
    if (diffDays === 2) return "Vakar";
    if (diffDays <= 7) return `Prieš ${diffDays} d.`;
    if (diffDays <= 30) return `Prieš ${Math.ceil(diffDays / 7)} sav.`;
    if (diffDays <= 365) return `Prieš ${Math.ceil(diffDays / 30)} mėn.`;
    return `Prieš ${Math.ceil(diffDays / 365)} m.`;
  }

  static getCategoryDisplayName(category: Category): string {
    const names: Partial<Record<Category, string>> = {
      [Category.GAMES]: "Žaidimai",
      [Category.CONSOLES]: "Konsolės",
      [Category.ACCESSORIES]: "Priedai",
      [Category.PC_COMPONENTS]: "PC komponentai",
      [Category.MERCHANDISE]: "Atributika",
      [Category.COLLECTIBLES]: "Kolekcijos",
      [Category.DIGITAL]: "Skaitmeniniai",
      [Category.OTHER]: "Kita",
    };
    return names[category] ?? String(category);
  }

  static isValidCategory(category: string): category is Category {
    return Object.values(Category).includes(category as Category);
  }
}

// Analytics utilities
export class AnalyticsUtils {
  static calculateListingStats(listings: Listing[]) {
    const total = listings.length;
    const totalValue = listings.reduce(
      (sum, listing) => sum + listing.price,
      0
    );
    const averagePrice = total > 0 ? totalValue / total : 0;

    const categoryBreakdown = Object.values(Category)
      .map((category) => {
        const categoryListings = listings.filter(
          (l) => l.category === category
        );
        return {
          category,
          count: categoryListings.length,
          percentage: total > 0 ? (categoryListings.length / total) * 100 : 0,
          totalValue: categoryListings.reduce((sum, l) => sum + l.price, 0),
        };
      })
      .filter((stat) => stat.count > 0);

    const mostExpensive = listings.reduce(
      (max, listing) => (listing.price > max.price ? listing : max),
      listings[0] || { price: 0 }
    );

    const cheapest = listings.reduce(
      (min, listing) => (listing.price < min.price ? listing : min),
      listings[0] || { price: Infinity }
    );

    return {
      total,
      totalValue,
      averagePrice,
      categoryBreakdown,
      mostExpensive: mostExpensive.price > 0 ? mostExpensive : null,
      cheapest: cheapest.price < Infinity ? cheapest : null,
    };
  }

  static getRecentActivity(listings: Listing[], days: number = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return listings
      .filter((listing) => new Date(listing.createdAt) >= cutoffDate)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}
