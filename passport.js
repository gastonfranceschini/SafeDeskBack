const dataUsuarios = require('./data/usuarios');
// Estrategia de autenticación con google
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// Estrategia de autenticación con Facebook
var FacebookStrategy = require('passport-facebook').Strategy;

require('dotenv').config()

// Exportamos como módulo las funciones de passport, de manera que
// podamos utilizarlas en otras partes de la aplicación.De esta manera, mantenemos el código separado en varios archivos
module.exports = function(passport) {

	// Serializa al usuario para almacenarlo en la sesión
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	// Deserializa el objeto usuario almacenado en la sesión para
	// poder utilizarlo
	passport.deserializeUser(function(obj, done) {
		done(null, obj);
	});

	// Configuración del autenticado con Facebook
	passport.use(new FacebookStrategy({
		clientID	: process.env.KeyFacebook,
		clientSecret	: process.env.SecretFacebook,
		callbackURL	 : '/api/auth/facebook/callback',
		passReqToCallback: true,
		profileFields : ['id', 'displayName', /*'provider',*/ 'photos']
	}, async function(req,accessToken, refreshToken, profile, done) {
		let usuario = await dataUsuarios.getUsuarioPorProvider(profile.id,profile.provider)
		if(usuario!= null) 
		{
			req.user = usuario;
			return done(null, usuario);
		}

    	const nuevoUsuario = {
              nombre: profile.displayName,
			  provider_id : profile.id,
			  provider	: profile.provider,
              password: ""}
		let result = await dataUsuarios.pushUsuario(nuevoUsuario)
		let usuarionew = await dataUsuarios.getUsuarioPorProvider(profile.id,profile.provider)
		req.user = usuarionew;
		return done(null, usuarionew);
	
	}));

	// Configuración del autenticado con google
	passport.use(new GoogleStrategy({
		clientID	: process.env.KeyGoogle,
		clientSecret	: process.env.SecretGoogle,
		callbackURL	 : '/api/auth/google/callback',
		passReqToCallback: true,
		profileFields : ['id', 'displayName']
	}, async function(req,accessToken, refreshToken, profile, done) {

		let usuario = await dataUsuarios.getUsuarioPorProvider(profile.id,profile.provider)
		if(usuario!= null) 
		{
			req.user = usuario;
			return done(null, usuario);
		}

    	const nuevoUsuario = {
              nombre: profile.displayName,
			  provider_id : profile.id,
			  provider	: profile.provider,
              password: ""}
		let result = await dataUsuarios.pushUsuario(nuevoUsuario)
		let usuarionew = await dataUsuarios.getUsuarioPorProvider(profile.id,profile.provider)
		req.user = usuarionew;
		return done(null, usuarionew);
	
	}));

};
