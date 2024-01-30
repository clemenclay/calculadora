	    



	    
var date = new Date();

var day = date.getDate();
var month = date.getMonth() + 1;
var year = date.getFullYear();

if (month < 10) month = "0" + month;
if (day < 10) day = "0" + day;

var today = year + "-" + month + "-" + day;

document.getElementById('fecha').value = today;
	

	    
	    

	    
	    
	    
	    
	    
        let es_domingo;
        let es_diurno;
        let es_feriado;
        let asae;
        let asa;
        let periodo;
        let ambiente;
        let uso;
        let recinto;
        let lmp;
        let lmpb;
        let msiete;
        let fecha;
        let hora;


        function validarPaso1() {

            fecha = new Date(document.getElementById('fecha').value);
            const diaSemana = fecha.getDay(); // 0 = Domingo, 1 = Lunes, ...
            es_domingo = diaSemana === 6; // 0 deberia ser domingo, pero esta tomando que la semana arranca el lunes..
            hora = parseInt(document.getElementById('horario').value.slice(0, 2), 10);
            es_diurno = hora >= 7 && hora < 22;
            asae = document.getElementById("asae").value;
            ambiente = document.getElementById("ambiente").value;


            if (isNaN(fecha) || isNaN(hora) || asae == 0 || ambiente == 0) {
                alert("El Campo Fecha, Hora, ASAE y Ambiente son obligatorios");
            } else {

                es_feriado = false;
                for (let i = 0; i < feriados.length; i++) {
                    if (fecha.getTime() === feriados[i].getTime()) {
                        es_feriado = true;
                        break;
                    }
                }
                document.getElementById('fecha').disabled = true;
                document.getElementById('horario').disabled = true;
                document.getElementById('asae').disabled = true;
                document.getElementById('ambiente').disabled = true;

                periodo = es_diurno ? 'DIU' : 'NDF';

                if (es_domingo || es_feriado) { periodo = 'NDF'; }

                const resultado = document.getElementById('periodolbl');
                resultado.textContent = es_feriado ? 'FERIADO' : es_domingo ? 'DOMINGO' : es_diurno ? 'DIURNO' : 'NOCTURNO';

                const cboasa = document.getElementById('asalbl');
                ambiente === "exterior" ? obtenerLimiteExt(asae, periodo) : document.getElementById('asalbl').style.display = "";

                console.log('asae: ', asae);
                if (asae === "2da" || asae === "3da" || asae === "3d" || asae === "4d" || asae === "5d") {
                    document.getElementById('asa').disabled = true;
                    document.getElementById('asa').selectedIndex = 2;
                    validaASA();
                    if (asae === "2da" || asae === "3da") {
                        document.getElementById('recinto').disabled = true;
                        document.getElementById('recinto').selectedIndex = 2;
                    }
                }
            }

        }

        function obtenerLimiteExt(asae, periodo) {

            // asae, periodo, limite
            var limites = [
                [["1", "DIU"], 60],
                [["1", "NDF"], 50],
                [["2", "DIU"], 65],
                [["2", "NDF"], 50],
                [["2d", "DIU"], 65],
                [["2d", "NDF"], 50],
                [["2da", "NDF"], 55],
                [["3", "DIU"], 70],
                [["3", "NDF"], 60],
                [["3d", "DIU"], 70],
                [["3d", "NDF"], 60],
                [["3da", "NDF"], 65],
                [["4", "DIU"], 75],
                [["4", "NDF"], 70],
                [["4d", "DIU"], 75],
                [["4d", "NDF"], 70],
                [["5", "DIU"], 80],
                [["5", "NDF"], 75],
                [["5d", "DIU"], 80],
                [["5d", "NDF"], 75]
            ];

            const seleccionados = [asae, periodo];

            console.log('Seleccionado: ', seleccionados);

            for (var i = 0; i < limites.length; i++) {
                let limite = limites[i];
                console.log('Registro : ', i);
                for (var j = 0; j < 1; j++) {
                    let lim = limite[0];
                    if (lim[0] === seleccionados[0] && lim[1] === seleccionados[1]) {
                        lmp = limite[1];
                        console.log('Registro : ', lim, ' - limite : ', lmp);
                    }
                }
            }
            document.getElementById('lmplbl').textContent = lmp + " db";
            mostrarMed();

        }

        function mostrarMed() {
            const mediciones = ['monm1', 'monm2', 'monm3', 'monlblt', 'moffm1', 'moffm2', 'moffm3', 'mofflblt', 'btncalcr', 'btnImprimir'];
            mediciones.forEach(id => document.getElementById(id).style.display = "");
        }


        function validaASA() {

            asa = document.getElementById("asa").value;

            const recintolbl = document.getElementById('recintolbl');
            const usolbl = document.getElementById('usolbl');
            const btnp2i = document.getElementById('btnp2i');

            recintolbl.style.display = asa === "7" ? "" : "none";
            usolbl.style.display = asa === "6" ? "" : "none";
            btnp2i.style.display = (asa === "6" || asa === "7") ? "" : "none";
        }


        function validarPaso2Int() {

            if (asa == "6") {
                uso = document.getElementById('uso').value;
                recinto = "0";
            }

            if (asa == "7") {
                recinto = document.getElementById('recinto').value;
                uso = "0";
            }

            document.getElementById('asa').disabled = true;
            document.getElementById('recinto').disabled = true;
            document.getElementById('uso').disabled = true;

            obtenerLimiteInt(asae, periodo, asa, recinto, uso);
        }

        function obtenerLimiteInt(asae, periodo, asa, recinto, uso) {
            // asae, periodo, asa, reciento, uso, limite, +7
            var limites = [
                [["1", "DIU", "6", "0", "SAN"], 50, "S"],
                [["1", "DIU", "6", "0", "ENS"], 50, "S"],
                [["1", "DIU", "6", "0", "CUL"], 50, "S"],
                [["1", "DIU", "6", "0", "OFI"], 55, "N"],
                [["1", "DIU", "6", "0", "COM"], 60, "N"],
                [["1", "DIU", "6", "0", "IND"], 60, "N"],
                [["1", "NDF", "6", "0", "SAN"], 40, "S"],
                [["1", "NDF", "6", "0", "ENS"], 50, "S"],
                [["1", "NDF", "6", "0", "CUL"], 50, "S"],
                [["1", "NDF", "6", "0", "OFI"], 55, "N"],
                [["1", "NDF", "6", "0", "COM"], 60, "N"],
                [["1", "NDF", "6", "0", "IND"], 60, "N"],
                [["1", "DIU", "7", "HAB", "0"], 50, "S"],
                [["1", "DIU", "7", "SER", "0"], 55, "S"],
                [["1", "DIU", "7", "SLVP", "0"], 60, "N"],
                [["1", "NDF", "7", "HAB", "0"], 40, "S"],
                [["1", "NDF", "7", "SER", "0"], 45, "S"],
                [["1", "NDF", "7", "SLVP", "0"], 50, "N"],
                [["2", "DIU", "6", "0", "SAN"], 50, "S"],
                [["2", "DIU", "6", "0", "ENS"], 50, "S"],
                [["2", "DIU", "6", "0", "CUL"], 50, "S"],
                [["2", "DIU", "6", "0", "OFI"], 55, "N"],
                [["2", "DIU", "6", "0", "COM"], 60, "N"],
                [["2", "DIU", "6", "0", "IND"], 60, "N"],
                [["2", "NDF", "6", "0", "SAN"], 40, "S"],
                [["2", "NDF", "6", "0", "ENS"], 50, "S"],
                [["2", "NDF", "6", "0", "CUL"], 50, "S"],
                [["2", "NDF", "6", "0", "OFI"], 55, "N"],
                [["2", "NDF", "6", "0", "COM"], 60, "N"],
                [["2", "NDF", "6", "0", "IND"], 60, "N"],
                [["2", "DIU", "7", "HAB", "0"], 50, "S"],
                [["2", "DIU", "7", "SER", "0"], 55, "S"],
                [["2", "DIU", "7", "SLVP", "0"], 60, "N"],
                [["2", "NDF", "7", "HAB", "0"], 40, "S"],
                [["2", "NDF", "7", "SER", "0"], 45, "S"],
                [["2", "NDF", "7", "SLVP", "0"], 50, "N"],
                [["2da", "NDF", "7", "SLVP", "0"], 55, "N"],
                [["3", "DIU", "6", "0", "SAN"], 50, "S"],
                [["3", "DIU", "6", "0", "ENS"], 50, "S"],
                [["3", "DIU", "6", "0", "CUL"], 50, "S"],
                [["3", "DIU", "6", "0", "OFI"], 55, "N"],
                [["3", "DIU", "6", "0", "COM"], 60, "N"],
                [["3", "DIU", "6", "0", "IND"], 60, "N"],
                [["3", "NDF", "6", "0", "SAN"], 40, "S"],
                [["3", "NDF", "6", "0", "ENS"], 50, "S"],
                [["3", "NDF", "6", "0", "CUL"], 50, "S"],
                [["3", "NDF", "6", "0", "OFI"], 55, "N"],
                [["3", "NDF", "6", "0", "COM"], 60, "N"],
                [["3", "NDF", "6", "0", "IND"], 60, "N"],
                [["3", "DIU", "7", "HAB", "0"], 55, "N"],
                [["3", "DIU", "7", "SER", "0"], 60, "N"],
                [["3", "DIU", "7", "SLVP", "0"], 70, "N"],
                [["3", "NDF", "7", "HAB", "0"], 45, "N"],
                [["3", "NDF", "7", "SER", "0"], 50, "N"],
                [["3", "NDF", "7", "SLVP", "0"], 60, "N"],
                [["3da", "NDF", "7", "SLVP", "0"], 65, "N"],
                [["3d", "DIU", "7", "HAB", "0"], 55, "N"],
                [["3d", "DIU", "7", "SER", "0"], 60, "N"],
                [["3d", "DIU", "7", "SLVP", "0"], 70, "N"],
                [["3d", "NDF", "7", "HAB", "0"], 45, "N"],
                [["3d", "NDF", "7", "SER", "0"], 50, "N"],
                [["3d", "NDF", "7", "SLVP", "0"], 60, "N"],
                [["4", "DIU", "6", "0", "SAN"], 50, "S"],
                [["4", "DIU", "6", "0", "ENS"], 50, "S"],
                [["4", "DIU", "6", "0", "CUL"], 50, "S"],
                [["4", "DIU", "6", "0", "OFI"], 55, "N"],
                [["4", "DIU", "6", "0", "COM"], 60, "N"],
                [["4", "DIU", "6", "0", "IND"], 60, "N"],
                [["4", "NDF", "6", "0", "SAN"], 40, "S"],
                [["4", "NDF", "6", "0", "ENS"], 50, "S"],
                [["4", "NDF", "6", "0", "CUL"], 50, "S"],
                [["4", "NDF", "6", "0", "OFI"], 55, "N"],
                [["4", "NDF", "6", "0", "COM"], 60, "N"],
                [["4", "NDF", "6", "0", "IND"], 60, "N"],
                [["4", "DIU", "7", "HAB", "0"], 60, "N"],
                [["4", "DIU", "7", "SER", "0"], 65, "N"],
                [["4", "DIU", "7", "SLVP", "0"], 75, "N"],
                [["4", "NDF", "7", "HAB", "0"], 50, "N"],
                [["4", "NDF", "7", "SER", "0"], 55, "N"],
                [["4", "NDF", "7", "SLVP", "0"], 70, "N"],
                [["4d", "DIU", "7", "HAB", "0"], 60, "N"],
                [["4d", "DIU", "7", "SER", "0"], 65, "N"],
                [["4d", "DIU", "7", "SLVP", "0"], 75, "N"],
                [["4d", "NDF", "7", "HAB", "0"], 50, "N"],
                [["4d", "NDF", "7", "SER", "0"], 55, "N"],
                [["4d", "NDF", "7", "SLVP", "0"], 70, "N"],
                [["5", "DIU", "6", "0", "SAN"], 50, "S"],
                [["5", "DIU", "6", "0", "ENS"], 50, "S"],
                [["5", "DIU", "6", "0", "CUL"], 50, "S"],
                [["5", "DIU", "6", "0", "OFI"], 55, "N"],
                [["5", "DIU", "6", "0", "COM"], 60, "N"],
                [["5", "DIU", "6", "0", "IND"], 60, "N"],
                [["5", "NDF", "6", "0", "SAN"], 40, "S"],
                [["5", "NDF", "6", "0", "ENS"], 50, "S"],
                [["5", "NDF", "6", "0", "CUL"], 50, "S"],
                [["5", "NDF", "6", "0", "OFI"], 55, "N"],
                [["5", "NDF", "6", "0", "COM"], 60, "N"],
                [["5", "NDF", "6", "0", "IND"], 60, "N"],
                [["5", "DIU", "7", "HAB", "0"], 60, "N"],
                [["5", "DIU", "7", "SER", "0"], 65, "N"],
                [["5", "DIU", "7", "SLVP", "0"], 80, "N"],
                [["5", "NDF", "7", "HAB", "0"], 50, "N"],
                [["5", "NDF", "7", "SER", "0"], 55, "N"],
                [["5", "NDF", "7", "SLVP", "0"], 75, "N"],
                [["5d", "DIU", "7", "HAB", "0"], 60, "N"],
                [["5d", "DIU", "7", "SER", "0"], 65, "N"],
                [["5d", "DIU", "7", "SLVP", "0"], 80, "N"],
                [["5d", "NDF", "7", "HAB", "0"], 50, "N"],
                [["5d", "NDF", "7", "SER", "0"], 55, "N"],
                [["5d", "NDF", "7", "SLVP", "0"], 75, "N"]
            ];

            var seleccionados = [asae, periodo, asa, recinto, uso];

            console.log('Seleccionado: ', seleccionados);

            for (var i = 0; i < limites.length; i++) {
                let limite = limites[i];
                console.log('Registro : ', i);
                for (var j = 0; j < 1; j++) {
                    let lim = limite[0];
                    if (lim[0] === seleccionados[0] && lim[1] === seleccionados[1] && lim[2] === seleccionados[2] && lim[3] === seleccionados[3] && lim[4] === seleccionados[4]) {
                        lmp = limite[1];
                        msiete = limite[2];
                        console.log('Registro 1: ', lim, ' - limite : ', lmp);
                    }
                }
            }

            document.getElementById('lmplbl').textContent = lmp + " db";

            mostrarMed();
        }


        function calcularRuido() {
		
            document.getElementById("resultadolmon").innerText = "";
            document.getElementById("resultadolmoff").innerText = "";
            document.getElementById("calculoruido").innerText = "";
            document.getElementById("lbllmlf").innerText = "";
            document.getElementById("lblle").innerText = "";

            const m1on = parseFloat(document.getElementById("m1on").value);
            const m2on = parseFloat(document.getElementById("m2on").value);
            const m3on = parseFloat(document.getElementById("m3on").value);

            lmp = lmpb > lmp ? lmpb : lmp;
            // Validar que los valores sean mayores a 0 y no est�n en blanco  
            if (isNaN(m1on) || m1on <= 0 || isNaN(m2on) || m2on <= 0 || isNaN(m3on) || m3on <= 0) {
                document.getElementById("resultadolmon").innerText = "Por favor, ingrese valores mayores a 0 en las cajas de texto.";
                return;
            }

            // Validar que la diferencia entre los extremos de la serie no sea mayor a 3
            var maximo = Math.max(m1on, m2on, m3on);
            var minimo = Math.min(m1on, m2on, m3on);
            if (maximo - minimo > 3) {
                document.getElementById("resultadolmon").innerText = "La diferencia entre los extremos de la serie no debe ser mayor a 3db.";
                return;
            }

            var lm = (m1on + m2on + m3on) / 3
            document.getElementById("resultadolmon").innerText = "LM = " + lm.toFixed(1);

            const m1off = parseFloat(document.getElementById("m1off").value);
            const m2off = parseFloat(document.getElementById("m2off").value);
            const m3off = parseFloat(document.getElementById("m3off").value);


            // Validar que los valores sean mayores a 0 y no est�n en blanco  
            if (isNaN(m1off) || m1off <= 0 || isNaN(m2off) || m2off <= 0 || isNaN(m3off) || m3off <= 0) {
                document.getElementById("resultadolmoff").innerText = "Por favor, ingrese valores mayores a 0 en las cajas de texto.";
                return;
            }

            // Validar que la diferencia entre los extremos de la serie no sea mayor a 3
            var maximo = Math.max(m1off, m2off, m3off);
            var minimo = Math.min(m1off, m2off, m3off);
            if (maximo - minimo > 3) {
                document.getElementById("resultadolmoff").innerText = "La diferencia entre los extremos de la serie no debe ser mayor a 3db.";
                return;
            }

            var lf = (m1off + m2off + m3off) / 3
            document.getElementById("resultadolmoff").innerText = "LF = " + lf.toFixed(1);

            var lmlf = lm - lf;
            document.getElementById("lbllmlf").innerText = "LM - LF =" + lmlf.toFixed(1);
            var le = 0

            console.log('mas 7 : ', msiete);
            document.getElementById('lmplbld').textContent = "LMP:";
            document.getElementById('lmplblm7d').textContent = "";
            document.getElementById('lmplblm7v').textContent = "";

            if (msiete = "S") {
                lfmsiete = lf + 7
                if (lfmsiete < lmp) {
                    //const limitelbl = document.getElementById('lmplbl');                                        
                    document.getElementById('lmplbld').textContent = "LMP:";
                    document.getElementById('lmplblm7d').textContent = "LMP aplicable:";
                    document.getElementById('lmplblm7v').textContent = lfmsiete.toFixed(1) + " db";
                    document.getElementById('lmplbl').textContent = lmp.toFixed(1) + " db o LF+7";
                    lmpb = lmp
                    lmp = lfmsiete
                }
            }


            if (lmlf < 3) {
                document.getElementById("calculoruido").innerText = "Ruidos No Evaluables por producirse Enmascaramiento";
                return;
            }
            if (lmlf >= 3 && lmlf < 10) {
                var delta = obtenerDelta(lmlf.toFixed(1));
                le = lm - parseFloat(delta);
                document.getElementById("lblle").innerText = "LE = " + le.toFixed(1) + " (LM = " + lm.toFixed(1) + " - Delta = " + delta + " )";
            }
            if (lmlf >= 10) {
                le = lm
                document.getElementById("lblle").innerText = "LE = " + le.toFixed(1) + " (LM = " + lm.toFixed(1) + " )";
            }


            if (le > 0) {
                if (le > lmp) {
                    document.getElementById("calculoruido").innerText = "EL LE (" + le.toFixed(1) + ") SUPERA EL LIMITE MAXIMO PERMITIDO (" + lmp.toFixed(1) + " db)";
                } else {
                    document.getElementById("calculoruido").innerText = "EL LE (" + le.toFixed(1) + ")  NO SUPERA EL LIMITE MAXIMO PERMITIDO (" + lmp.toFixed(1) + " db)";
                }
            }
        }

	    
	    
	    

     

	    
	    
	    
	    
	    
	    
	    
        function obtenerDelta(delta) {

            var tablaDelta = [
                ["3.0", "3.0"],
                ["3.1", "2.9"],
                ["3.2", "2.8"],
                ["3.3", "2.7"],
                ["3.4", "2.7"],
                ["3.5", "2.6"],
                ["3.6", "2.5"],
                ["3.7", "2.4"],
                ["3.8", "2.3"],
                ["3.9", "2.3"],
                ["4.0", "2.2"],
                ["4.1", "2.1"],
                ["4.2", "2.1"],
                ["4.3", "2.0"],
                ["4.4", "2.0"],
                ["4.5", "1.9"],
                ["4.6", "1.8"],
                ["4.7", "1.8"],
                ["4.8", "1.7"],
                ["4.9", "1.7"],
                ["5.0", "1.7"],
                ["5.1", "1.6"],
                ["5.2", "1.6"],
                ["5.3", "1.5"],
                ["5.4", "1.5"],
                ["5.5", "1.4"],
                ["5.6", "1.4"],
                ["5.7", "1.4"],
                ["5.8", "1.3"],
                ["5.9", "1.3"],
                ["6.0", "1.3"],
                ["6.1", "1.2"],
                ["6.2", "1.2"],
                ["6.3", "1.2"],
                ["6.4", "1.1"],
                ["6.5", "1.1"],
                ["6.6", "1.1"],
                ["6.7", "1.0"],
                ["6.8", "1.0"],
                ["6.9", "1.0"],
                ["7.0", "1.0"],
                ["7.1", "0.9"],
                ["7.2", "0.9"],
                ["7.3", "0.9"],
                ["7.4", "0.9"],
                ["7.5", "0.9"],
                ["7.6", "0.8"],
                ["7.7", "0.8"],
                ["7.8", "0.8"],
                ["7.9", "0.8"],
                ["8.0", "0.7"],
                ["8.1", "0.7"],
                ["8.2", "0.7"],
                ["8.3", "0.7"],
                ["8.4", "0.7"],
                ["8.5", "0.7"],
                ["8.6", "0.6"],
                ["8.7", "0.6"],
                ["8.8", "0.6"],
                ["8.9", "0.6"],
                ["9.0", "0.6"],
                ["9.1", "0.6"],
                ["9.2", "0.6"],
                ["9.3", "0.5"],
                ["9.4", "0.5"],
                ["9.5", "0.5"],
                ["9.6", "0.5"],
                ["9.7", "0.5"],
                ["9.8", "0.5"],
                ["9.9", "0.5"]
            ];

            for (var i = 0; i < tablaDelta.length; i++) {
                let valortabla = parseFloat(tablaDelta[i][0]).toFixed(1);
                console.log('Registro : ', valortabla, 'Buscado : ', delta);
                if (valortabla === delta) {
                    return tablaDelta[i][1];
                }
            }

            return 0;

        }

        const feriados = [
	    new Date('2024-01-12'), // Feriado Carnaval
            new Date('2024-01-13'), // Feriado Carnaval

        ];

