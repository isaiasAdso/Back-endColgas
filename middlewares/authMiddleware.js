const jwt = require("jsonwebtoken");

const SECRET_KEY = "mi_clave_secreta";

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).send("Token requerido");
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Agregar la información del usuario al request
    next();
  } catch (error) {
    console.error("Error de autenticación:", error.message);
    res.status(401).send("Token inválido");
  }
};
