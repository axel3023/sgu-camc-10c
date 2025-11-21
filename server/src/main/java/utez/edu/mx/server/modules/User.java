package utez.edu.mx.server.modules;

import jakarta.persistence.*;

@Entity
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false,unique = true)
    private String correo;

    @Column(length = 15,nullable = false)
    private String tel;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public User(Long id, String name, String correo, String tel) {
        this.id = id;
        this.name = name;
        this.correo = correo;
        this.tel = tel;
    }

    public User(String tel, String correo, String name) {
        this.tel = tel;
        this.correo = correo;
        this.name = name;
    }

    public User(){

    }
}
