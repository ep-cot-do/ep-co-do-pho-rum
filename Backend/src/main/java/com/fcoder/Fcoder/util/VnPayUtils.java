package com.fcoder.Fcoder.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Map;
import java.util.StringJoiner;
import java.util.TreeMap;

public class VnPayUtils {
    public static String createQueryUrl(Map<String, String> params, String hashSecret) {
        Map<String, String> sortedParams = new TreeMap<>(params);
        StringJoiner query = new StringJoiner("&");
        StringBuilder hashData = new StringBuilder();

        for (Map.Entry<String, String> entry : sortedParams.entrySet()) {
            query.add(entry.getKey() + "=" + entry.getValue());
            if (!hashData.isEmpty()) {
                hashData.append("&");
            }
            hashData.append(entry.getKey()).append("=").append(entry.getValue());
        }

        String secureHash = hmacSHA512(hashSecret, hashData.toString());
        query.add("vnp_SecureHash=" + secureHash);
        return query.toString();
    }

    public static boolean validateResponse(Map<String, String> response, String hashSecret) {
        String secureHash = response.remove("vnp_SecureHash");
        String hashData = createQueryUrl(response, hashSecret).split("&vnp_SecureHash=")[0];

        return hmacSHA512(hashSecret, hashData).equals(secureHash);
    }

    private static String hmacSHA512(String key, String data) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-512");
            md.update(key.getBytes(StandardCharsets.UTF_8));
            byte[] hashedBytes = md.digest(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();

            for (byte b : hashedBytes) {
                hexString.append(String.format("%02x", b));
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error generating HMAC SHA-512", e);
        }
    }
}