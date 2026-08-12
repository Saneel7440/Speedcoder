package com.codetype.dao;

import com.codetype.model.TypingResult;
import com.codetype.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class TypingResultDAO {

    public void save(TypingResult result) throws SQLException {
        String sql = """
                INSERT INTO typing_results
                (language_name, wpm, accuracy, mistakes, total_characters, duration_seconds)
                VALUES (?, ?, ?, ?, ?, ?)
                """;

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, result.getLanguage());
            ps.setDouble(2, result.getWpm());
            ps.setDouble(3, result.getAccuracy());
            ps.setInt(4, result.getMistakes());
            ps.setInt(5, result.getTotalCharacters());
            ps.setInt(6, result.getDurationSeconds());
            ps.executeUpdate();
        }
    }

    public List<TypingResult> findRecent(int limit) throws SQLException {
        List<TypingResult> results = new ArrayList<>();

        String sql = """
                SELECT id, language_name, wpm, accuracy, mistakes,
                       total_characters, duration_seconds, created_at
                FROM typing_results
                ORDER BY created_at DESC
                LIMIT ?
                """;

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, limit);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    TypingResult r = new TypingResult();
                    r.setId(rs.getInt("id"));
                    r.setLanguage(rs.getString("language_name"));
                    r.setWpm(rs.getDouble("wpm"));
                    r.setAccuracy(rs.getDouble("accuracy"));
                    r.setMistakes(rs.getInt("mistakes"));
                    r.setTotalCharacters(rs.getInt("total_characters"));
                    r.setDurationSeconds(rs.getInt("duration_seconds"));
                    r.setCreatedAt(rs.getTimestamp("created_at").toString());
                    results.add(r);
                }
            }
        }
        return results;
    }
}
