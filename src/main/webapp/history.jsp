<%@ page import="java.util.List" %>
<%@ page import="com.codetype.model.TypingResult" %>
<%@ page contentType="text/html;charset=UTF-8" %>
<%
    List<TypingResult> results = (List<TypingResult>) request.getAttribute("results");
%>
<!DOCTYPE html>
<html>
<head>
    <title>CodeType - History</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/style.css">
</head>
<body>
<header class="nav">
    <a class="logo" href="${pageContext.request.contextPath}/">Code<span>Type</span></a>
    <nav>
        <a href="${pageContext.request.contextPath}/test.jsp">Practice</a>
        <a href="${pageContext.request.contextPath}/history">History</a>
    </nav>
</header>

<main class="container">
    <section class="page-heading">
        <div class="badge">YOUR RESULTS</div>
        <h1>Practice History</h1>
        <p>Latest saved typing sessions.</p>
    </section>

    <div class="table-wrap">
        <table>
            <thead>
            <tr>
                <th>Language</th>
                <th>WPM</th>
                <th>Accuracy</th>
                <th>Mistakes</th>
                <th>Characters</th>
                <th>Date</th>
            </tr>
            </thead>
            <tbody>
            <% if (results == null || results.isEmpty()) { %>
                <tr><td colspan="6" class="empty">No results yet. Complete your first test.</td></tr>
            <% } else {
                for (TypingResult r : results) { %>
                <tr>
                    <td><%= r.getLanguage() %></td>
                    <td><strong><%= String.format("%.0f", r.getWpm()) %></strong></td>
                    <td><%= String.format("%.1f", r.getAccuracy()) %>%</td>
                    <td><%= r.getMistakes() %></td>
                    <td><%= r.getTotalCharacters() %></td>
                    <td><%= r.getCreatedAt() %></td>
                </tr>
            <% }} %>
            </tbody>
        </table>
    </div>
</main>
</body>
</html>
