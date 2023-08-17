const express = require("express")
const corse =require("cors")
const app =express()
app.use(express.static('public'))
app.use(corse())
app.use(express.json())
const jugadores=[]

class Jugador{
    constructor(id){
        this.id=id
    }
    asignarluchador(luchador){
        this.luchador=luchador
    }
    actualizarposicion(x,y){
        this.x=x
        this.y=y
    }
    asignarataques(ataques){
        this.ataques=ataques
    }
}
class Luchador{
    constructor(nombre){
        this.nombre=nombre
    }
}
app.get("/unirse",(req,res)=>{
    const id = `${Math.random()}`
    const jugador=new Jugador(id)
    jugadores.push(jugador)
    res.setHeader("Access-Control-Allow-Origin","*")

    res.send(id)
})



app.post("/luchadores/:jugadorid",(req,res)=>{
    const jugadorid=req.params.jugadorid || ""
    const nombre = req.body.luchador || ""
    const luchador=new Luchador(nombre)
    const jugadorindex= jugadores.findIndex((jugador)=>jugadorid=== jugador.id)
    if(jugadorindex>=0){
        jugadores[jugadorindex].asignarluchador(luchador)
    }
    console.log(jugadores)
    console.log(jugadorid)

    res.end()
})

app.post("/luchador/:jugadorid/posicion", (req,res) => {
    const jugadorid=req.params.jugadorid || ""
    const x =req.body.x || 0
    const y =req.body.y || 0
    const jugadorindex= jugadores.findIndex((jugador)=>jugador.id=== jugadorid)
    if(jugadorindex>=0){
        jugadores[jugadorindex].actualizarposicion(x,y)
    }

    const enemigos=jugadores.filter((jugador)=>jugadorid!= jugador.id)

    res.send({
        enemigos
    })
})
app.post("/luchador/:jugadorid/ataques", (req,res) => {
    const jugadorid=req.params.jugadorid || ""
    const ataques =req.body.ataques || []
    const jugadorindex= jugadores.findIndex((jugador)=>jugador.id=== jugadorid)
    if(jugadorindex>=0){
        jugadores[jugadorindex].asignarataques(ataques)
    }

  
    res.end()
})

app.get("/luchador/:jugadorid/ataques",(req,res)=>{
    const jugadorid=req.params.jugadorid || ""
    const jugador=jugadores.find((jugador)=> jugador.id === jugadorid)

    res.send({
        ataques : jugador.ataques || []
    })
})


app.listen(8080, ()=>{
    console.log("servidor funcionando")
})