var minasMaximas = 0;
var minasMarcadas = 0;
var cores = ["#638bcd", "#00ae46", "#ee0011", "#9b00b2", "LightCoral", "LightSeaGreen"];
var matrix = new Array(8);
var minasMarcadasM = new Array(8);
//cronometro
var seg = 0;
var min = 0;
var funcionando = false;
//scroll: server para tocar as animações quando o usuario gira a bolinha
var supportPageOffset = window.pageXOffset !== undefined;
var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
var scrollTop;

function atualizarCronometro() {

    if (funcionando) {
        seg++;

        if (seg >= 60) {
            seg = 0;
            min++;
        }

        document.getElementById("clock").innerText = min + ":" + seg;

    }


}
setInterval("atualizarCronometro()", 1000);

function construirMatrix() {
    for (var x = 0; x < 8; x++) {

        matrix[x] = new Array(8);
        minasMarcadasM[x] = new Array(8);
        matrix[x][parseInt((Math.random() * 8))] = "f"; //colocando mina em uma casa aleatoria entre 0 e 8
    }
    // o loop só cria 8 minas, logo coloco mais duas em posicoes aleatorias e marce se alguma mina já esta no lugar. 
    if (matrix[parseInt(Math.random() * 8)][parseInt(Math.random() * 8)] == null) {

        matrix[parseInt(Math.random() * 8)][parseInt(Math.random() * 8)] = "f";
    } else {

        minasMaximas--;
    }
    if (matrix[parseInt(Math.random() * 8)][parseInt(Math.random() * 8)] == null) {

        matrix[parseInt(Math.random() * 8)][parseInt(Math.random() * 8)] = "f";
    } else {

        minasMaximas--;
    }

    minasMaximas += 10;
    document.getElementById("conter").innerText = minasMaximas;

    // loop para colocar os numetos
    for (var x = 0; x < 8; x++) {

        for (var y = 0; y < 8; y++) {
            if (matrix[x][y] != "f") {
                var numeroDeMinas = 0;
                try { // tentar contar quantas minas estão ao redor
                    if (x > 0) {
                        //minas de cima
                        if (matrix[x - 1][y - 1] == "f" || matrix[x - 1][y] == "f" || matrix[x - 1][y + 1] == "f") {

                            numeroDeMinas++;
                        }
                    }

                    //laterais
                    if (matrix[x][y - 1] == "f" || matrix[x][y + 1] == "f") {
                        numeroDeMinas++;

                    }
                    //minas de baixo
                    if (matrix[x + 1][y - 1] == "f" || matrix[x + 1][y] == "f" || matrix[x + 1][y + 1] == "f") {

                        numeroDeMinas++;
                    }


                } catch{ }

                matrix[x][y] = numeroDeMinas;
            }
            document.getElementById("campo").innerHTML += "<div class='cel' marcado='0' id= " + x + y + " onclick='jogar(" + x + "," + y + ")'" + "oncontextmenu='marcarBomba(" + x + "," + y + ")'></div>";
        }
    }
    console.table(matrix);

}
//para marcado temos: 0=sem bomba
function jogar(x, y) {
    var elemento = document.getElementById(x + "" + y);
    if (elemento.getAttribute("marcado") == "0") {
        funcionando = true;
        var valor = matrix[x][y];

        if (valor == "f" || valor == "y") {
            alert("morreu");

        }
        else {

            if (valor != null) {
                if (elemento.innerText == "") {
                    calcProbabilidades(x, y);
                    console.table(minasMarcadasM);
                }
                elemento.innerHTML = "<p>" + valor + "</p>";
                elemento.style.backgroundColor = cores[valor - 1];


            } else {
                marcarCasasVizinhas(x, y);
            }
        }
    }

}

//ao apertar botão direiro, marca-se a bomba. 
function marcarBomba(x, y) {
    var elemento = document.getElementById(x + "" + y);

    if (elemento.getAttribute("marcado") == "0") {
        if (elemento.innerText == "") {
            minasMarcadas++;
            elemento.innerText = "🔴";
            elemento.setAttribute("marcado", "1");
            minasMarcadas[x][y] = true;
            if (matrix[x][y] == "f") {
                matrix[x][y] = "y";

            }
        }
    } else {
        minasMarcadas--;
        elemento.innerText = "";
        elemento.setAttribute("marcado", "0");
        minasMarcadas[x][y] = false;
        if (matrix[x][y] == "y") {
            matrix[x][y] = "f";
        }

    }

    document.getElementById("conter").innerText = minasMarcadas + "/" + minasMaximas;
    if (minasMarcadas >= minasMaximas) {
        for (var a = 0; a < 8; a++) {
            for (var b = 0; b < 8; b++) {
                if (matrix[a][b] == "f") {
                    console.table(matrix);
                    alert("faliceu");
                    a = 10; b = 10;
                    break;
                }
            }

        }
        alert("vc é pica");
    }
}

//calcula, sem saber a matriz, a probabilidade de ter um bomba nas casas vizinhas
function calcProbabilidades(x, y) {

    var celula = matrix[x][y];
    if (celula != null && celula != "f" && celula != "g") {

        var possibilidade = Math.round([celula * 100 / 8]);
        o = -1;
        //casas de cima e de baixo
        for (var n = -1; n < 2; n++) {
            try {

                if (minasMarcadasM[x + o][y + n]) {
                    minasMarcadasM[x + o][y + n] += possibilidade;
                } else {
                    minasMarcadasM[x + o][y + n] = possibilidade;
                }
                document.getElementById((x + o) + "" + (y + n)).innerText = minasMarcadasM[x + o][y + n] + "%";

                if (n == 1 && o == -1) {
                    n = -2;
                    o = 1;
                }

            } catch{

            }
        }
        try {

            //casas laterais

            if (minasMarcadasM[x][y + 1]) {
                minasMarcadasM[x][y + 1] += possibilidade;
                minasMarcadasM[x][y - 1] += possibilidade;

            } else {
                minasMarcadasM[x][y + 1] = possibilidade;
                minasMarcadasM[x][y - 1] = possibilidade;
            }
            document.getElementById(x + "" + (y - 1)).innerText = minasMarcadasM[x][y - 1] + "%";
            document.getElementById(x + "" + (y + 1)).innerText = minasMarcadasM[x][y + 1] + "%";
        } catch{
        }
    }
}


function marcarCasasVizinhas(x, y) {
    var i = y;
    var j = x;

    //diagonal superior esquerda
    while (i >= 0 && j >= 0 && matrix[j][i] == null) {

        try {

            for (var a = j; matrix[a][i] == null; a++) {

                document.getElementById(a + "" + i).style.backgroundColor = "#E0E0E0";
            }
        } catch{

        }

        i--;
        j--;
    }

    //diagonal inferior direita
    i = y;
    j = x;
    while (i < 8 && j < 8 && matrix[j][i] == null) {



        try {

            for (var a = j; matrix[a][i] == null; a--) {



                document.getElementById(a + "" + i).style.backgroundColor = "#E0E0E0";
            }
        } catch{

        }


        i++;
        j++;
    }

}

construirMatrix();

//função que cuida das animações quando da o cliente mexe a bolinha do mouse
function scroll() {
    var scrollLeft = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
    scrollTop = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
    document.title = scrollTop;

    if (scrollTop > 50) {
        document.getElementById("t-intro").style.animation = "fading 2s ";
        document.getElementById("t-intro").style.opacity = 1;

    }
}