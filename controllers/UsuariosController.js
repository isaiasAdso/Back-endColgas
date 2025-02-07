const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Usuarios = require("../models/UsuariosModels");
const SECRET_KEY = "f9e8a830ba74b77a7d6a52785e7cbb6a5ef0b6f4c9ac1e1d321df5aa5b7cb4f17f79cd926e10f3fbb1a74a832407b7ff99b8f2b4e6e63a815c2e1125c4dfad1a";
const authMiddleware = require("../middlewares/authMiddleware");

// Obtener todos los usuarios
router.get("/ObtenerUsuarios", async (req, res) => {
  try {
    const usuarios = await Usuarios.find();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error.message);
    res.status(500).send("Error al obtener usuarios");
  }
});

// Obtener un usuario por ID
router.get("/ObtenerUsuario/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuarios.findById(id);
    if (!usuario) {
      return res.status(404).send("Usuario no encontrado");
    }
    res.status(200).json(usuario);
  } catch (error) {
    console.error("Error al obtener usuario:", error.message);
    res.status(500).send("Error al obtener usuario");
  }
});

// Crear un usuario
router.post("/CrearUsuario", async (req, res) => {
  const { Nombre, Apellido, Cedula, Correo, Direccion, Telefono, Contrasena, role } = req.body;
  try {
    const newUser = new Usuarios({ Nombre, Apellido, Cedula, Correo, Direccion, Telefono, Contrasena, role });
    await newUser.save();
    res.status(201).send("Usuario creado exitosamente");
  } catch (error) {
    console.error("Error al crear usuario:", error.message);
    res.status(500).send("Error al crear usuario");
  }
});

// Actualizar un usuario por ID
router.put("/ActualizarUsuario/:id", async (req, res) => {
  const { id } = req.params;
  const { Nombre, Apellido, Cedula, Correo, Direccion, Telefono, Contrasena, role } = req.body;
  try {
    const usuarioActualizado = await Usuarios.findByIdAndUpdate(id, { Nombre, Apellido, Cedula, Correo, Direccion, Telefono, Contrasena, role }, {
      new: true, // Devuelve el documento actualizado
      runValidators: true, // Aplica las validaciones definidas en el esquema
    });
    if (!usuarioActualizado) {
      return res.status(404).send("Usuario no encontrado");
    }
    res.status(200).json(usuarioActualizado);
  } catch (error) {
    console.error("Error al actualizar usuario:", error.message);
    res.status(500).send("Error al actualizar usuario");
  }
});

// Eliminar un usuario por ID
router.delete("/EliminarUsuario/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const usuarioEliminado = await Usuarios.findByIdAndDelete(id);
    if (!usuarioEliminado) {
      return res.status(404).send("Usuario no encontrado");
    }
    res.status(200).send("Usuario eliminado exitosamente");
  } catch (error) {
    console.error("Error al eliminar usuario:", error.message);
    res.status(500).send("Error al eliminar usuario");
  }
});

// Registrar Usuario
router.post("/RegistrarUsuario", async (req, res) => {
    const { Nombre, Apellido, Cedula, Correo, Direccion, Telefono, Contrasena, Descripcion, role  } = req.body;
  
    try {
      // Verificar si el correo ya está registrado
      const existingUser = await Usuarios.findOne({ Cedula });
      if (existingUser) {
        return res.status(400).send("El Usuario ya está registrado");
      }
  
      // Crear el usuario
      const nuevoUsuario = new Usuarios({
        Nombre,
        Apellido,
        Cedula,
        Correo,
        Telefono,
        Contrasena,
        Direccion,
        Descripcion,
        role,
      });
  
      await nuevoUsuario.save();
      res.status(201).send("Usuario registrado exitosamente");
    } catch (error) {
      console.error("Error al registrar usuario:", error.message);
      res.status(500).send("Error del servidor");
    }
  });

   //Iniciar sesión
   router.post("/LoginUsuario", async (req, res) => {
     const { Correo, Contrasena } = req.body;
  
     try {
       // Buscar el usuario por correo
       const usuario = await Usuarios.findOne({ Correo });
      if (!usuario) {
         return res.status(404).send("Correo no registrado");
       }
  
       // Comparar la contraseña
       const isPasswordValid = await bcrypt.compare(Contrasena, usuario.Contrasena);
       if (!isPasswordValid) {
         return res.status(401).send("Contraseña incorrecta");
       }
  
       // Generar el token
       const token = jwt.sign(
         { id: usuario._id,
           Correo: usuario.Correo,
           Nombre: usuario.Nombre,
          Apellido: usuario.Apellido,
          role: usuario.role},
        SECRET_KEY,
         { expiresIn: "2h" } // Expiración del token
       );
  
       res.status(200).json({ message: "Login exitoso", token });
     } catch (error) {
       console.error("Error al iniciar sesión:", error.message);
       res.status(500).send("Error del servidor");
     }
   });
  
module.exports = router;
