// *********************************************************************************
// CHARACTER.JS - THIS FILE CREATES A MODELED OF INDIVIDUAL CHARACTERS IN DB
// *********************************************************************************

// Dependency

// This may be confusing but here Sequelize (capital) references the standard library
var Sequelize = require("sequelize"); 
// sequelize (lowercase) references my connection to the DB. You could name it something else, but I was just following their convention.
var sequelize = require("../config/connection.js"); 

// Creates a "Character" model that matches up with DB
var Character = sequelize.define("characters", {
	userName: {
		type: Sequelize.STRING(),
		allowNull: false,
		primaryKey: true
	},
  	password: {
		type: Sequelize.STRING(),
		allowNull: false
	},
	charName: {
		type: Sequelize.STRING()
	},
	charClass: {
		type: Sequelize.STRING()
	},
	race: {
		type: Sequelize.STRING()
	},
	alignment: {
		type: Sequelize.STRING()
	},
	exp: {
		type: Sequelize.INTEGER().UNSIGNED
	},
	armorClass: {
		type: Sequelize.INTEGER().UNSIGNED
	},
	strength: {
		type: Sequelize.INTEGER().UNSIGNED
	},
	dexterity: {
		type: Sequelize.INTEGER().UNSIGNED
	},
	constitution: {
		type: Sequelize.INTEGER().UNSIGNED
	},
	intelligence: {
		type: Sequelize.INTEGER().UNSIGNED
	},
	wisdom: {
		type: Sequelize.INTEGER().UNSIGNED
	},
	charisma: {
		type: Sequelize.INTEGER().UNSIGNED
	},
	level: {
		type: Sequelize.INTEGER().UNSIGNED
	},
	hitPoints: {
		type: Sequelize.INTEGER()
	},
	hitDice: {
		type: Sequelize.STRING()
	},
	speed: {
		type: Sequelize.INTEGER().UNSIGNED
	},
	initiative: {
		type: Sequelize.INTEGER().UNSIGNED
	},
	copper: {
		type: Sequelize.INTEGER().UNSIGNED
	},
	silver: {
		type: Sequelize.INTEGER().UNSIGNED
	},
	gold: {
		type: Sequelize.INTEGER().UNSIGNED
	},
	platinum: {
		type: Sequelize.INTEGER().UNSIGNED
	},
	proficiency: {
		type: Sequelize.INTEGER().UNSIGNED
	},
	feats: {
		type: Sequelize.TEXT()
	},
	inventory: {
		type: Sequelize.TEXT()
	},
	weapons: {
		type: Sequelize.STRING()
	},
	weaponTypes: {
		type: Sequelize.STRING()
	},
	weaponRanges: {
		type: Sequelize.STRING()
	},
	weaponDamages: {
		type: Sequelize.STRING()
	},
	storyNotes: {
		type: Sequelize.TEXT()
	},
	other: {
		type: Sequelize.TEXT()
	}
});

// Syncs with DB
Character.sync();

// Makes the Character Model available for other files (will also create a table)
module.exports = Character;
