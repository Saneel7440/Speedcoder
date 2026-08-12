package com.codetype.servlet;

import com.codetype.dao.TypingResultDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;

@WebServlet("/history")
public class HistoryServlet extends HttpServlet {

    private final TypingResultDAO dao = new TypingResultDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        try {
            req.setAttribute("results", dao.findRecent(20));
            req.getRequestDispatcher("/history.jsp").forward(req, resp);
        } catch (Exception e) {
            throw new ServletException("Could not load history.", e);
        }
    }
}
