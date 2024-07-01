const nodemailer = require('nodemailer');
const moment = require('moment');

// Configura tu transporte de correo aquí
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Por ejemplo, Gmail
  auth: {
    user: process.env.EMAIL_USER, // Tu correo electrónico
    pass: process.env.EMAIL_PASS, // Tu contraseña de correo electrónico
  },
});

// Función para enviar correos electrónicos
const sendWelcomeEmail = (to, username) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Remitente
    to, // Destinatario
    subject: 'Bienvenido a Cisco iWise Library',
    text: `Hola ${username},\n\n¡Bienvenido a la Biblioteca virtual de Cisco! Estamos encantados de tenerte con nosotros, comienza a rentar tus libros favoritos ahora.\n\nSaludos`,
  };

  return transporter.sendMail(mailOptions);
};

const sendRentalEmail = async (email, bookTitle) => {
  try {
    const returnDate = moment().add(2, 'months').format('DD/MM/YYYY');

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      cc: "ciscoiwise@gmail.com",
      subject: 'iWise Library. Has rentado un libro',
      text: `Disfruta tu libro y recuerda cuidarlo mucho por favor!\n\n Has rentado: ${bookTitle}\nRecuerda devolver tu libro dentro de dos meses. La fecha exacta de devolución es: ${returnDate}.`,
    });
    console.log('Rental email sent successfully');
  } catch (error) {
    console.error('Error sending rental email:', error);
    throw error;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendRentalEmail,
};
