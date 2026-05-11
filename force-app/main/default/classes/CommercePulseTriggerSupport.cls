public with sharing class CommercePulseTriggerSupport {
    public static String normalizeCode(String value) {
        return String.isBlank(value) ? null : value.trim().toUpperCase();
    }

    public static String normalizeEmail(String value) {
        return String.isBlank(value) ? null : value.trim().toLowerCase();
    }

    public static String truncateText(String value, Integer maxLength) {
        if (String.isBlank(value)) {
            return value;
        }

        return value.length() > maxLength ? value.substring(0, maxLength) : value;
    }

    public static String deriveCustomerSegment(Decimal totalSpent, Date lastOrderDate) {
        Decimal normalizedSpend = totalSpent == null ? 0 : totalSpent;

        if (lastOrderDate != null && lastOrderDate <= Date.today().addDays(-365) && normalizedSpend == 0) {
            return 'Lost';
        }

        if (lastOrderDate != null && lastOrderDate <= Date.today().addDays(-180) && normalizedSpend > 0) {
            return 'At Risk';
        }

        if (normalizedSpend >= 10000) {
            return 'VIP';
        }

        if (normalizedSpend >= 1000) {
            return 'Regular';
        }

        return 'New';
    }
}
