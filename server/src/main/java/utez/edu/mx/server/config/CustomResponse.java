package utez.edu.mx.server.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class CustomResponse {
    private Map<String,Object> response;

    public ResponseEntity<String> getOkResponse(Object data){
        response = new HashMap<>();
        response.put("message","Operacion Exitosa");
        response.put("status","OK");
        if (data != null){
            response.put("data",data);
        }
        return new ResponseEntity(response.toString(), HttpStatus.OK);
    }
    public ResponseEntity<Map<String, Object>> getJSONResponse(Object data) {
        Map<String, Object> body = new HashMap<>();
        body.put("message", "Operación exitosa");
        body.put("status", "Ok");
        if (data != null) {
            body.put("data", data);
        }

        return new ResponseEntity<>(body, HttpStatus.OK);
    }

    public ResponseEntity<Map<String, Object>> getLoginJSONResponse(Object data, Boolean firstTime, Boolean hasAlmacen) {
        System.out.println("data: " + data);
        Map<String, Object> body = new HashMap<>();
        body.put("message", "Operación exitosa");
        body.put("status", "Ok");
        body.put("firstLogin", firstTime);
        body.put("hasAlmacen", hasAlmacen);
        if (data != null) {
            body.put("data", data);
        }

        return new ResponseEntity<>(body, HttpStatus.OK);
    }

    public ResponseEntity<String> getCreatedResponse(String message) {
        response = new HashMap<>();
        response.put("message", message);
        response.put("status", "Created");

        return new ResponseEntity<>(response.toString(), HttpStatus.CREATED);
    }

    public ResponseEntity<String> get400Response(int code) {
        response = new HashMap<>();
        response.put("message", code == 400 ? "No se pudo realizar la operación" : "No se encontró recurso solicitado");
        response.put("status", code==400 ? "Bad Request":"Not Found");

        return new ResponseEntity<>(response.toString(), code == 400 ? HttpStatus.BAD_REQUEST : HttpStatus.NOT_FOUND);
    }


    public ResponseEntity<Map<String, Object>> getBadRequest(String message) {
        response = new HashMap<>();
        response.put("message", message);
        response.put("status", "Bad Request");

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}
