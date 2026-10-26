import	express,	{	Request,	Response	}	from	'express';
import dotenv from "dotenv"
dotenv.config()
const	app	=	express();
const	PORT= process.env.PORT || 3000;

app.listen(PORT,	()	=>	{
console.log(`Serveur	démarré	sur	http://localhost:${PORT}`);
});