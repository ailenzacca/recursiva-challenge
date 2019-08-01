const csvFilePath = 'socios.csv'
const csv = require('csvtojson')
csv({
    noheader: true,
    delimiter: ';'

})
.fromFile(csvFilePath)
.then((jsonObj) => {
    const data = jsonObj.map(p => {
        return {
            nombre: p.field1,
            edad: p.field2,
            equipo: p.field3,
            estado: p.field4,
            estudios: p.field5
        }
    });

    getPeople(data);
    console.log(`
    ====================================================================================
    Promedio de edad de los hinchas de Racing: ${getAgeAverageByTeam(data, 'Racing')} años
    ====================================================================================


    =================================================
    Los primeros 100 socios casados y universitarios son:`)
    console.log(first100(data));

    console.log(`
    =================================================
    Los cinco nombres más comunes son:`)
    console.log(commonName(data));

    console.log(`
    =================================================
    Información de socios por equipo:`)
    console.log(members(data));

    })

//OBTENER PERSONAS REGISTRADAS
const getPeople = data => {
    console.log(`
    =================================================
    Cantidad de personas registradas: ${data.length}
    =================================================`);
}


//-----------------------------------------------------------------------

//TRAER EL PRIMEDIO DE EDAD DE LOS HINCHAS DE RACING
const getAgeAverageByTeam = (data, club) => {
    let allAges = 0;
    let people = 0;

    for (let team of data) {
        if (team.equipo === club) {
            people++;
            allAges += parseInt(team.edad);
        }
    }

    let total = allAges / people;

    return total;
}

//-----------------------------------------------------------------------

//LOS PRIMEROS 100 EN SER CASADOS Y UNIVERSITARIOS
const first100 = data => {
    let people = [];


    for (let name of data) {
        if (name.estado === 'Casado' && name.estudios === 'Universitario' && people.length < 100) {
            people.push({
                nombre: name.nombre,
                equipo: name.equipo,
                edad: name.edad
            });
        }
    }
    return people
}


//-----------------------------------------------------------------------

//LOS CINCO NOMBRES MÁS COMUNES
const commonName = data => {
    let info = []

    for (const team of data) {

        if (team.equipo === 'River') {
            let person = info.find(n => team.nombre === n.nombre);

            if (person) {
                person.cantidad = person.cantidad + 1;
            } else {
                info.push({
                    nombre: team.nombre,
                    cantidad: 1
                })
            }
        }
    }

    info.sort((a, b) => {
        if (a.cantidad < b.cantidad) {
            return 1;
        }
        if (a.cantidad > b.cantidad) {
            return -1;
        }
        return 0;
    }
    )
    let total = info.slice(0, 5).map(u => u.nombre)
    return total;

}


//-----------------------------------------------------------------------

//SOCIOS POR CADA EQUIPO

const members = data => {
    let teams = [];

    for (const team of data) {
        let equipo = teams.find(e => team.equipo === e.equipo);

        if (equipo) {
            equipo.socios = equipo.socios + 1;

        } else {
            teams.push({
                equipo: team.equipo,
                socios: 1,
                edadPromedio: getAgeAverageByTeam(data, team.equipo).toFixed(2),
                rangoEdad: getAges(data, team.equipo),

            })
        }
    }

    teams.sort((a, b) => {
        if (a.socios < b.socios) {
            return 1;
        }
        if (a.socios > b.socios) {
            return -1;
        }

        return 0;
    })

    return teams
}

const getAges = (data, team) => {
    let mayorEdad = 0;
    let menorEdad = 0;
    let todasEdades = [];
    let final = null;
    for (const info of data) {
        if (info.equipo === team) {
            todasEdades.push(
                parseInt(info.edad)

            );

        }
    }

    todasEdades.sort();
    menorEdad = todasEdades.shift();
    mayorEdad = todasEdades.pop();

    final = {
        edadMayor: mayorEdad,
        edadMenor: menorEdad
    }


    return final;
}