package utez.edu.mx.server.modules;

public class UserDto {
    private String name;
    private String correo;
    private String tel;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public User toEntity() {
        return new User(name, correo, tel);
    }
}