package com.codetype.servlet;

import com.codetype.dao.TypingResultDAO;
import com.codetype.model.TypingResult;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;

@WebServlet("/save-result")
public class SaveResultServlet extends HttpServlet {

    private final TypingResultDAO dao = new TypingResultDAO();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        try {
            String language = req.getParameter("language");
            double wpm = Double.parseDouble(req.getParameter("wpm"));
            double accuracy = Double.parseDouble(req.getParameter("accuracy"));
            int mistakes = Integer.parseInt(req.getParameter("mistakes"));
            int totalCharacters = Integer.parseInt(req.getParameter("totalCharacters"));
            int duration = Integer.parseInt(req.getParameter("duration"));

            TypingResult result = new TypingResult(
                    language, wpm, accuracy, mistakes, totalCharacters, duration
            );

            dao.save(result);

            resp.sendRedirect(req.getContextPath() + "/history");
        } catch (Exception e) {
            throw new ServletException("Could not save typing result.", e);
        }
    }
}
