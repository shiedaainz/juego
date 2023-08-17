//const { json } = require("express")

const sectioataque=document.getElementById('seleccionar-ataque')
const sectioreinicio=document.getElementById('reiniciar')
const botonMascotaJugador = document.getElementById('boton-mascota')


const botonreinicio=document.getElementById('boton-reiniciar')

const sectiomascota=document.getElementById('seleccionar-mascota')

const spanMascotaJugador = document.getElementById('mascota-jugador')

const spanmascostaenemigo=document.getElementById('mascota-enemigo')
const vidaj=document.getElementById('vidas-jugador')
const vidae=document.getElementById('vidas-enemigo')

const sectionresultado=document.getElementById('resultado')
const sectionataquej=document.getElementById('ataquejug')
const sectionataquee=document.getElementById('ataqueene')

const sectionmensajes=document.getElementById('resultado')
const contenedorluchadores=document.getElementById('contendorluchadores')
const contenedorataques=document.getElementById('contenedorataques')
const sectionmapa=document.getElementById('ver-mapa')
const mapa=document.getElementById('mapa')

let ataquejugador=[]
let ataquenemigo=[]
let vidaeneme =3
let vidajuga  =3
let luchadores=[]
let mascotajugador
let inputHipodoge 
let inputCapipepo      
let inputRatigueya
let ataquesluchadores
let luchadorobjeto
let botonfuego
let botonagua
let botontierra
let opcionluchadores
let mokeponesenemigos=[]
let botones=[]
let ataquesluchadorenemigo
let indexataquejugador
let indexataqueenemigo
let victoriasjugador=0
let victoriasenemigo=0
let lienzo= mapa.getContext("2d")
let intervalo
let mapabackgroun = new Image()
mapabackgroun.src='./imagenes/mapa2.jpg'
let alturamapa
let anchomapa = window.innerWidth-20
let jugadorid =null
let enemigoid = null
const anchomaximomapa=350

if(anchomapa>anchomaximomapa){
    anchomapa = anchomaximomapa-20
}

alturamapa=anchomapa*600/800

mapa.width=anchomapa
mapa.height=alturamapa

class Luchador{
    constructor(nombre ,diseño, vida , id=null){
        this.nombre=nombre
        this.diseño=diseño
        this.vida=vida
        this.ataques=[]
        this.ancho=30
        this.id=id
        this.alto=30
        this.x=aleatorio(0,mapa.width-this.ancho)
        this.y=aleatorio(0,mapa.height-this.alto)
        this.mapafoto=new Image()
        this.mapafoto.src=diseño
        this.velocidadx=0
        this.velocidady=0
    }
    pintarluchador(){
        lienzo.drawImage(this.mapafoto,this.x,this.y,this.ancho,this.alto)
    }

}
let hipodoge = new Luchador('Cloud','./imagenes/cloud.png',10)

let capipepo = new Luchador('Red_x','./imagenes/red_x.png',10)

let ratigueya = new Luchador('Tiffa','./imagenes/tiffa.png',10)



const Hipodoge_ataques=[{nombre: './imagenes/materia_de_fuego.png', id:'materia-de-fuego',nom:'1'},
{nombre:'./imagenes/materia_de_agua.png', 
id:'materia-de-agua',nom:'2'},
{nombre:'./imagenes/materia_de_tierra.png',
id:'materia-de-tierra',nom:'3'}]
const Capipepo_ataques=[{nombre: './imagenes/materia_de_fuego.png', id:'materia-de-fuego',nom:'1'},
{nombre:'./imagenes/materia_de_agua.png', id:'materia-de-agua',nom:'2'},
{nombre:'./imagenes/materia_de_tierra.png',id:'materia-de-tierra',nom:'3'}]

const Ratigueya_ataques=[{nombre: './imagenes/materia_de_fuego.png', id:'materia-de-fuego',nom:'1'},
{nombre:'./imagenes/materia_de_agua.png', id:'materia-de-agua',nom:'2'},
{nombre:'./imagenes/materia_de_tierra.png',id:'materia-de-tierra',nom:'3'}]
ratigueya.ataques.push(...Ratigueya_ataques)

capipepo.ataques.push(...Capipepo_ataques)
hipodoge.ataques.push(...Hipodoge_ataques)


luchadores.push(hipodoge,capipepo,ratigueya)
function iniciarJuego() {
    
    sectioataque.style.display = 'none'
    sectionmapa.style.display='none'
    luchadores.forEach((luchadore)=>{
        opcionluchadores = `<input type="radio" name="mascota" id=${luchadore.nombre} / >
        <label class= "mokepon" for=${luchadore.nombre}>
            <p>${luchadore.nombre}</p>
            <img src=${luchadore.diseño} alt=${luchadore.nombre}>
        </label>`

    contenedorluchadores.innerHTML +=opcionluchadores

    inputHipodoge = document.getElementById('Cloud')
    inputCapipepo = document.getElementById('Red_x')  
    inputRatigueya = document.getElementById('Tiffa')
    })

    sectioreinicio.style.display = 'none'
    botonMascotaJugador.addEventListener('click', seleccionarMascotaJugador)
    
    botonreinicio.addEventListener('click',reiniciar)

    unirseraljuego()
}

function unirseraljuego(){
    fetch("http://10.0.0.32:8080/unirse")
        .then(function (res){
            if(res.ok){
                res.text()
                    .then(function (respuesta){
                        console.log(respuesta)
                        jugadorid=respuesta
                    })
            }

        })
}

function seleccionarMascotaJugador() {
    sectiomascota.style.display = 'none'
    
    
    if (inputHipodoge.checked) {
        spanMascotaJugador.innerHTML = inputHipodoge.id
        mascotajugador=inputHipodoge.id
    } else if (inputCapipepo.checked) {
        spanMascotaJugador.innerHTML = inputCapipepo.id
        mascotajugador=inputCapipepo.id
    } else if (inputRatigueya.checked) {
        spanMascotaJugador.innerHTML = inputRatigueya.id
        mascotajugador=inputRatigueya.id
    } else {
        alert('ACASO PIENSAS PELIAR A LOS PUÑOS ')
        reiniciar()
    }
    seleccionluchador(mascotajugador)
    extraerAtaques(mascotajugador)
    
    sectionmapa.style.display='flex'
    iniciarmundo()

}

function seleccionluchador(mascotaJugador){
    fetch(`http://10.0.0.32:8080/luchadores/${jugadorid}`,{
        method:"post",
        headers:{
            "Content-type":"application/json"
        },
        body: JSON.stringify({
            luchador: mascotaJugador
        })
    })
}

function extraerAtaques(mascotaJugador) {
    let ataques
    for (let i = 0; i < luchadores.length; i++) {
        if (mascotaJugador==luchadores[i].nombre) {
            ataques=luchadores[i].ataques
            
        }
    }
    mostrarAtaques(ataques)

}
function mostrarAtaques(ataques) {
    ataques.forEach((ataque)=>{
        ataquesluchadores = `<button id=${ataque.id} class="ataque" >${ataque.nom}</button>`

        contenedorataques.innerHTML +=ataquesluchadores
    })
    botonfuego =document.getElementById('materia-de-fuego')
    botonagua =document.getElementById('materia-de-agua')
    botontierra =document.getElementById('materia-de-tierra')

    botones=document.querySelectorAll('.ataque')
    

   
}
function secuenciataque(){
    botones.forEach((boton) =>{
        boton.addEventListener('click' ,(e)=>{
           if(e.target.textContent ==='1'){
            ataquejugador.push('materia fuego')
            console.log(ataquejugador)
            boton.style.background= '#112f58'
            boton.disabled=true
           }else if(e.target.textContent ==='2'){
            ataquejugador.push('materia agua')
            console.log(ataquejugador)
            boton.style.background= '#112f58'
            boton.disabled=true
           }else{
            ataquejugador.push('materia tierra')
            console.log(ataquejugador)
            boton.style.background= '#112f58'
            boton.disabled=true
           }
           console.log(ataquejugador)
           if(ataquejugador.length === 3){
            enviarataques()

           }
           
        })
    })
    
}

function enviarataques(){
    fetch(`http://10.0.0.32:8080/luchador/${jugadorid}/ataques`,{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            ataques: ataquejugador
        })
        
    })
    intervalo=setInterval(obtenerataque , 50)

}

function obtenerataque(){
    fetch(`http://10.0.0.32:8080/luchador/${enemigoid}/ataques`)
        .then(function(res){
            if (res.ok){
                res.json()
                    .then(function({ataques}){
                        if (ataques.length === 3){
                            ataquenemigo = ataques
                            combateextremo()
                        }
                    })
            }
        })
}


function selecionmascotaenemigo(enemigo){
    spanmascostaenemigo.innerHTML=enemigo.nombre
    ataquesluchadorenemigo=enemigo.ataques
    secuenciataque()
}


function ataqueenemigo(){
    let ataquealeatorio=aleatorio(0,ataquesluchadorenemigo.length-1)
    if (ataquealeatorio==0){
        ataquenemigo.push('materia fuego')
    }else if (ataquealeatorio==1){
        ataquenemigo.push('materia agua')
    }else{
        ataquenemigo.push('materia tierra')
    }
    console.log(ataquenemigo)
    iniciarpelea()
}

function iniciarpelea(){
    if (ataquejugador.length===3) {
        combateextremo()
    }
}

function indexAtaques(jugador,enemigo){
    indexataquejugador=ataquejugador[jugador]
    indexataqueenemigo=ataquenemigo[enemigo]
}
function combateextremo(){

    clearInterval(intervalo)
    
    for (let index = 0; index < ataquejugador.length; index++) {
        if(ataquejugador[index]===ataquenemigo[index]){
            indexAtaques(index,index)
            crearmensajes('EMPATE')
        }else if(ataquejugador[index]=='materia fuego' && ataquenemigo[index]=='materia tierra'){
            indexAtaques(index,index)
            crearmensajes('GANASTE')
            victoriasjugador++
            vidaj.innerHTML=victoriasjugador
        }else if(ataquejugador[index]=='materia agua' && ataquenemigo[index]=='materia fuego'){
            indexAtaques(index,index)
            crearmensajes('GANASTE')
            victoriasjugador++
            vidaj.innerHTML=victoriasjugador
        }else if (ataquejugador[index]=='materia tierra' && ataquenemigo[index]=='materia agua'){
            indexAtaques(index,index)
            crearmensajes('GANASTE')
            victoriasjugador++
            vidaj.innerHTML=victoriasjugador
        }else{
            indexAtaques(index,index)
            crearmensajes('PERDISTE')
            victoriasenemigo++
            vidae.innerHTML=victoriasenemigo
        }
    }
    revisarvidas()
}
function revisarvidas(){
    if(victoriasjugador===victoriasenemigo){
        mensajefinish('NI PA TI NI PA MI')
    }else if(victoriasjugador>victoriasenemigo){
        mensajefinish('SI MIRAS QUE SI PUDISTE BIEN HECHO, CRACK MASTODONTE')
    }else{
        mensajefinish('LASTIMA PERO TE GANO UNA MAQUINA :V')
    }
}

function crearmensajes(resultado){
    

    let nuevoataque=document.createElement('p')
    let nuevoataquee=document.createElement('p')
    

    sectionresultado.innerHTML=resultado
    nuevoataque.innerHTML=indexataquejugador
    nuevoataquee.innerHTML=indexataqueenemigo
    sectionataquej.appendChild(nuevoataque)
    sectionataquee.appendChild(nuevoataquee)
}

function mensajefinish(resultadof){
    
    sectionmensajes.innerHTML=resultadof
    
    sectioreinicio.style.display = 'block'

}
function reiniciar(){

    location.reload()
}
function aleatorio(min, max){
    return Math.floor(Math.random()*(max -min +1)+min)
}
function pintarCanvas(){

    luchadorobjeto.x = luchadorobjeto.x + luchadorobjeto.velocidadx
    luchadorobjeto.y = luchadorobjeto.y +  luchadorobjeto.velocidady
    lienzo.clearRect(0,0,mapa.width,mapa.height)
    lienzo.drawImage(mapabackgroun,0,0, mapa.width,mapa.height)
    luchadorobjeto.pintarluchador()

    enviarposicion(luchadorobjeto.x,luchadorobjeto.y)
    mokeponesenemigos.forEach(function(luchador){
        luchador.pintarluchador()
        revisarcolisiones(luchador)
    })

    
}

function enviarposicion(x,y){
    fetch(`http://10.0.0.32:8080/luchador/${jugadorid}/posicion `,{
        method: "post",
        headers:{
            "Content-type":"application/json"
        },
        body:JSON.stringify({
            x,
            y
        })
    })
     .then(function (res){
        if(res.ok){
            res.json()
                .then(function ({enemigos}){
                    console.log(enemigos)
                    mokeponesenemigos= enemigos.map(function(enemigo){
                        let luchadorenemigo =null 
                        const luchadornombre = enemigo.luchador.nombre || []
                        if(luchadornombre ==="Cloud"){
                            luchadorenemigo = new Luchador('Cloud','./imagenes/cloud.png',10,enemigo.id)
                        }else if (luchadornombre ==="Red_x"){
                            luchadorenemigo= new Luchador('Red_x','./imagenes/red_x.png',10,enemigo.id)
                        }else if (luchadornombre==="Tiffa"){
                            luchadorenemigo = new Luchador('Tiffa','./imagenes/tiffa.png',10,enemigo.id)
                        }

                        
                        luchadorenemigo.x=enemigo.x
                        luchadorenemigo.y=enemigo.y
                        return luchadorenemigo
                    })
                    
                    
                    
                })
        }
     })
}
function moverderecha(){
    luchadorobjeto.velocidadx=5
}
function moverizquierda(){
    luchadorobjeto.velocidadx= -5
}
function moverabajo(){
    luchadorobjeto.velocidady=5
    
}
function moverarriba(){
    luchadorobjeto.velocidady=-5
     
}
function detenermoviente(){
    luchadorobjeto.velocidadx=0
    luchadorobjeto.velocidady=0
}
function teclado(event){
    switch (event.key) {
        case 'ArrowUp':
            moverarriba()
            break
        case 'ArrowDown':
            moverabajo()
            break
        case 'ArrowLeft':
            moverizquierda()
            break
        case 'ArrowRight':
            moverderecha()
            break
        default:
            break;
    }
}

function iniciarmundo(){
    luchadorobjeto= obtenerluchador(mascotajugador)
    intervalo=setInterval(pintarCanvas,50)
    window.addEventListener('keydown', teclado)
    window.addEventListener('keyup',detenermoviente)
}
function obtenerluchador(mascotaJugador){
    for (let i = 0; i < luchadores.length; i++) {
        if (mascotaJugador==luchadores[i].nombre) {
            return luchadores[i]
            
        }
    }
}

function revisarcolisiones(enemigo){
    const arribaenemigo =enemigo.y
    const abajoenemigo=enemigo.y + enemigo.alto
    const derechaenemigo =enemigo.x + enemigo.ancho
    const izquierdaenemigo=enemigo.x

    const arribamascota =luchadorobjeto.y
    const abajomascota=luchadorobjeto.y + luchadorobjeto.alto
    const derechamascota =luchadorobjeto.x + luchadorobjeto.ancho
    const izquierdamascota=luchadorobjeto.x

    if (abajomascota<arribaenemigo || arribamascota>abajoenemigo || derechamascota<izquierdaenemigo || izquierdamascota > derechaenemigo) {
        return
        
    }
    detenermoviente()
    clearInterval(intervalo)
    enemigoid = enemigo.id
    sectioataque.style.display = 'flex'
    sectionmapa.style.display='none'
    selecionmascotaenemigo(enemigo)
}
window.addEventListener('load', iniciarJuego)
