import com.fasterxml.jackson.databind.ObjectMapper;
import vo.Point;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@WebServlet(urlPatterns = "/board/api")
public class Api extends HttpServlet {

    ObjectMapper mapper = new ObjectMapper();
    List<Point> points = new ArrayList<>();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));
        String json = "";
        if (br != null)
            json = br.readLine();

        Point point = mapper.readValue(json, Point.class);
        points.add(point);
        if (!points.get(0).getType().equals("START")) {
            points.remove(0);
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

            response.setContentType("application/json");
            mapper.writeValue(response.getOutputStream(), points);
    }
}




