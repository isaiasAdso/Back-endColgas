const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    Nombre: { type: String, required: true },
    Apellido: { type: String, required: true },
    Cedula: { type: Number, required: true },
    Correo: {
      type: String,
      required: true,
      unique: false,
      default: "user@gmail.com",
    },
    Direccion: { type: String, required: true },
    Telefono: { type: Number, required: true },
    Contrasena: { type: String, required: false, default: "123456" },
    Descripcion: { type: String, required: false, default: "Sin descripción" },
    role: { type: String, default: "user" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Middleware para encriptar contraseña antes de guardar
userSchema.pre("save", async function (next) {
  if (!this.isModified("Contrasena")) return next();
  const salt = await bcrypt.genSalt(10);
  this.Contrasena = await bcrypt.hash(this.Contrasena, salt);
  next();
});

module.exports = mongoose.model("Usuarios", userSchema);
