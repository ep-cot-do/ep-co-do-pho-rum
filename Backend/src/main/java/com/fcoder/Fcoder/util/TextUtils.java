package com.fcoder.Fcoder.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TextUtils {
    private TextUtils(){}
    public static String toCamelCase(String text, boolean isCapitalizeFirst) {
        String[] words = text.split("[\\W_]+");
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < words.length; i++) {
            String word = words[i];
            if (isCapitalizeFirst && !word.isEmpty()) {
                word = Character.toUpperCase(word.charAt(0)) + word.substring(1).toLowerCase();
            } else if (!word.isEmpty()) {
                word = word.toLowerCase();
            }
            builder.append(word);
        }
        return builder.toString();
    }

    public static String toCamelCase(String text){
        return toCamelCase(text, false);
    }

    public static String kebabToCamel(String kebabCaseString) {
        if (kebabCaseString == null || kebabCaseString.isEmpty()) {
            return kebabCaseString;
        }

        String[] parts = kebabCaseString.split("-");
        StringBuilder camelCaseString = new StringBuilder(parts[0]);

        for (int i = 1; i < parts.length; i++) {
            camelCaseString.append(parts[i].substring(0, 1).toUpperCase());
            camelCaseString.append(parts[i].substring(1));
        }

        return camelCaseString.toString();
    }

    public static String camelToKebab(String camelCaseString) {
        if (camelCaseString == null || camelCaseString.isEmpty()) {
            return camelCaseString;
        }

        StringBuilder kebabCaseString = new StringBuilder();
        for (int i = 0; i < camelCaseString.length(); i++) {
            char c = camelCaseString.charAt(i);
            if (Character.isUpperCase(c)) {
                kebabCaseString.append('-');
                kebabCaseString.append(Character.toLowerCase(c));
            } else {
                kebabCaseString.append(c);
            }
        }

        return kebabCaseString.toString();
    }

    public static Map<String, String> convertKeysToCamel(Map<String, String> parameters) {
        Map<String, String> camelCaseParameters = new HashMap<>();
        for (Map.Entry<String, String> entry : parameters.entrySet()) {
            String camelCaseKey = kebabToCamel(entry.getKey());
            camelCaseParameters.put(camelCaseKey, entry.getValue());
        }
        return camelCaseParameters;
    }
    public static boolean isValidUrl(String url) {
        return url != null && (url.startsWith("http://") || url.startsWith("https://"));
    }

    public static List<String> extractValidUrls(String urlString) {
        String[] urlsArray = urlString.split(",");
        List<String> validUrls = new ArrayList<>();

        for (String url : urlsArray) {
            String trimmedUrl = url.trim();
            if (isValidUrl(trimmedUrl)) {
                validUrls.add(trimmedUrl);
            }
        }
        return validUrls;
    }
}
