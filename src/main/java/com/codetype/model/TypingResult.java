package com.codetype.model;

public class TypingResult {
    private int id;
    private String language;
    private double wpm;
    private double accuracy;
    private int mistakes;
    private int totalCharacters;
    private int durationSeconds;
    private String createdAt;

    public TypingResult() {}

    public TypingResult(String language, double wpm, double accuracy,
                        int mistakes, int totalCharacters, int durationSeconds) {
        this.language = language;
        this.wpm = wpm;
        this.accuracy = accuracy;
        this.mistakes = mistakes;
        this.totalCharacters = totalCharacters;
        this.durationSeconds = durationSeconds;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public double getWpm() { return wpm; }
    public void setWpm(double wpm) { this.wpm = wpm; }

    public double getAccuracy() { return accuracy; }
    public void setAccuracy(double accuracy) { this.accuracy = accuracy; }

    public int getMistakes() { return mistakes; }
    public void setMistakes(int mistakes) { this.mistakes = mistakes; }

    public int getTotalCharacters() { return totalCharacters; }
    public void setTotalCharacters(int totalCharacters) { this.totalCharacters = totalCharacters; }

    public int getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(int durationSeconds) { this.durationSeconds = durationSeconds; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
