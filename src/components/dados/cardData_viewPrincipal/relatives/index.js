/* Importing util libraries .*/
import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

/* Style from local folder .*/
import { Container } from './styles';

let variable;
let hour;
let minutes;
let seconds;
let formated_hour;
let date;
let dia, mes, ano, formated_date;
let add = 0;
let vazaoEntradaII;
let vazaoPermeadoII;
let vazaoConcentradoII;
let pressaoEntradaII;
let pressaoConcentradoII;
let pressaoPermeadoI = 0.1;
let condutividadeEntradaII;
let condutividadePermeadoII;
let temperaturaEntradaII;

let button=0;

 // valores iniciais - tempo zero
 const vazaoPermeadoZero = 60.94;
 const vazaoConcentradoZero = 20.74;
 const pressaoEntrada = 8.76;
 const pressaoConcentradoZero = 7.68;
 const pressaoPermeadoZero = 6.14;
 const condutividadePermeadoZero = 2;
 const temperaturaEntradaZero = 25;
 const pressureNetDrivingZero = 2.02514;
 const correcaoTemperaturaZero = 1;
 const concentracaoMediaCalculadaEntradaZero = 69.087149;
 const TDSCalculatedFeedZero = 37.603419;

  //relativo tempo zero
  const PressaoDiferencialRelativoZero = 10;
  const RejeicaoSalRelativoZero = 10;
  const VazaoNormalizadaRelativoZero = 10;

    let VazaoNormalizadaRelativo;
    let RejeicaoSalRelativo;
    let PressaoDiferencialRelativo;

export default class entrada extends Component {
    constructor(props) {
        super(props);
        this.state = {
            VazaoNormalizadaRelativo:0,  
            RejeicaoSalRelativo:0,
            PressaoDiferencialRelativo:0,
            style:{
                custom_card:{
                    color:'white',
                    minWidth: 12,
                    borderRadius:'25px',
                    backgroundColor:'#009065',
                    border: '0',
                    boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.19);',
                },
                custom_title:{
                    fontSize: 14,
                    color:'white',
                    borderRadius:'25px',
                },
                custom_root:{
                    flexGrow: 1,
                },
                custom_center_item:{
                    textAlign:"center",
                    width:'18%',
                },
                custom_button:{
                    fontSize:'14px',
                    fontWeight:'bold'
                }
            }
        }
    }

componentDidMount() {
    // Setting the URL to create a WebSocket connection with the back-end server .
    this.ws = new WebSocket(this.props.url);
    
    this.ws.onmessage = e => {
      /* Building the data structure that were text formated .*/
      const value = JSON.parse(e.data);
      var lista_teste=value.IotData.data;
      var lista_converted='';
      
      /* Uncrypting the data that comes from raspberry/plc .*/
      lista_teste.map(function(item,i){
        if(item!==32 && item!==0){
          lista_converted=lista_converted+String.fromCharCode(item);
        }
      });
      let dados = lista_converted.split(',');

      [, date] = dados[0].split(':');
      [dia,mes,ano]=date.split('/');
      /* Filtering variables */
      [, variable] = dados[2].split(':');
      /* Getting the exact hour */
      [, hour, minutes, seconds] = dados[1].split(':');
      formated_hour=`${date}-${hour}:${minutes}:${seconds}`;
      
      formated_date = new Date(ano,mes-1,dia,hour,minutes,seconds);


      [, vazaoPermeadoII] = dados[6].split(':');
      [, vazaoConcentradoII] = dados[7].split(':');
      [, pressaoEntradaII] = dados[9].split(':');
      [, pressaoConcentradoII] = dados[11].split(':');
      [, condutividadeEntradaII] = dados[2].split(':');
      [, condutividadePermeadoII] = dados[3].split(':');
      [, temperaturaEntradaII] = dados[5].split(':');
      [, vazaoEntradaII] = dados[8].split(':');

      let vazaoPermeadoI = parseFloat(vazaoPermeadoII);
      let vazaoConcentradoI = parseFloat(vazaoConcentradoII)
      let pressaoEntradaI = parseFloat(pressaoEntradaII)
      let pressaoConcentradoI = parseFloat(pressaoConcentradoII)
      let condutividadeEntradaI = parseFloat(condutividadeEntradaII)
      let condutividadePermeadoI = parseFloat(condutividadePermeadoII)
      let temperaturaEntradaI = parseFloat(temperaturaEntradaII)
      let vazaoEntradaI = parseFloat(vazaoEntradaII);

       //Calculus
       function funcTDSCalculatedFeed(condutividadeEntradaI) {
        if (condutividadeEntradaI == 0) { //TODO; Confirmar variavel ()
            let TDSCalculatedFeed;
            return TDSCalculatedFeed = 0;
        }
        if (condutividadeEntradaI > 0 && condutividadeEntradaI <= 7630) {
            let TDSCalculatedFeed = 7.7013840097 * Math.pow(10, -20) * Math.exp(Math.pow(-90.475562243 - Math.log(condutividadeEntradaI), 2) / 188.88442227);
            return TDSCalculatedFeed;
        }
        if (condutividadeEntradaI > 7630) {
            let TDSCalculatedFeed = 8.0090966 * Math.pow(10, -11) * Math.exp(Math.pow(-50.645805186 - Math.log(condutividadeEntradaI), 2) / 112.483950289);
            return TDSCalculatedFeed;
    
        }
    }
    let TDSCalculatedFeed = funcTDSCalculatedFeed(condutividadeEntradaI);
    // console.log(`Condutividade de Entrada: ${TDSCalculatedFeed}`);
    
    function funcTDSFeed(condutividadeEntradaI) {
        let TDSFeedI = condutividadeEntradaI * 0.7;
        return TDSFeedI;
    }
    let TDSFeedI = funcTDSFeed(condutividadeEntradaI);
    // console.log(`TDS feed: ${TDSFeedI}`);
    
    function funcTDSCalculatedPermeado(condutividadePermeadoI) {
        if (condutividadePermeadoI == 0) { //TODO; Confirmar variavel ()
            return TDSCalculatedPermeado = 0;
        }
        if (condutividadePermeadoI > 0 && condutividadePermeadoI <= 7630) {
            let TDSCalculatedPermeado = 7.7013840097 * Math.pow(10, -20) * Math.exp(Math.pow(-90.475562243 - Math.log(condutividadePermeadoI), 2) / 188.88442227);
            return TDSCalculatedPermeado;
        }
        if (condutividadePermeadoI > 7630) {
            let TDSCalculatedPermeado = 8.0090966 * Math.pow(10, -11) * Math.exp(Math.pow(-50.645805186 - Math.log(condutividadePermeadoI), 2) / 112.483950289);
            return TDSCalculatedPermeado;
        }
    }
    
    let TDSCalculatedPermeado = funcTDSCalculatedPermeado(condutividadePermeadoI);
    // console.log(`TDS Calculated Permeado: ${TDSCalculatedPermeado}`);
    
    function funcTDSPermeado(condutividadePermeadoI) {
        let TDSPermeado = condutividadePermeadoI * 0.7;
        return TDSPermeado;
    }
    
    let TDSPermeado = funcTDSPermeado(condutividadePermeadoI);
    // console.log(`TDS Permeado: ${TDSPermeado}`);
    
    // function funcVazaoEntrada(vazaoPermeadoZero, vazaoConcentradoZero) {
    //     let vazaoEntrada = vazaoPermeadoZero + vazaoConcentradoZero;
    //     return vazaoEntrada;
    // }
    
    // let vazaoEntradaI = funcVazaoEntrada(vazaoPermeadoI, vazaoConcentradoI);
    // // console.log(`Vazão de Entrada: ${vazaoEntradaI}`);
    
    function funcPressaoDiferencial(pressaoEntradaI, pressaoConcentradoI) {
    
        if (pressaoEntradaI > 0) {
            let pressaoDiferencialI = pressaoEntradaI - pressaoConcentradoI; //TODO; confiarmar variaveis (x)
            return pressaoDiferencialI
        }
        if (pressaoEntradaI <= 0) {
            let pressaoDiferencialI = 0;
            return pressaoDiferencialI
        }
    }
    
    let pressaoDiferencialI = funcPressaoDiferencial(pressaoEntradaI, pressaoConcentradoI);
    // console.log(`Pressão Diferencial: ${pressaoDiferencialI}`);
    
    function funcCorrecaoTemperatura(temperaturaEntradaI) {
        if (temperaturaEntradaI <= 0) {
            let correcaoTemperatura = 0;
            return correcaoTemperatura;
        } else {
            let correcaoTemperatura = Math.exp(2640 * ((1 / 298.15) - 1 / (temperaturaEntradaI + 273.15)));
            return correcaoTemperatura;
        }
    }
    
    let correcaoTemperatura = funcCorrecaoTemperatura(temperaturaEntradaI);
    // console.log(`Correção do fator de Temperatura: ${correcaoTemperatura}`);
    
    function funcConcentracaoMediaCalculadaEntrada(TDSCalculatedFeed, vazaoPermeadoI, condutividadeEntradaI, vazaoEntradaI, TDSFeedI) {
        if (vazaoPermeadoI > 0) {
            if (condutividadeEntradaI > 0) {
                let concentracaoMediaCalculadaEntrada = TDSCalculatedFeed * Math.log(1 / (1 - vazaoPermeadoI / vazaoEntradaI)) / (vazaoPermeadoI / vazaoEntradaI);
                return concentracaoMediaCalculadaEntrada;
                if (condutividadeEntradaI <= 0) {
                    let concentracaoMediaCalculadaEntrada = TDSFeedI * Math.log(1 / (1 - vazaoPermeadoI / vazaoEntradaI)) / (vazaoPermeadoI / vazaoEntradaI);
                    return concentracaoMediaCalculadaEntrada;
                }
            }
            if (vazaoPermeadoI <= 0) {
                let concentracaoMediaCalculadaEntrada;
                return concentracaoMediaCalculadaEntrada = 0;
            }
        }
    }
    let concentracaoMediaCalculadaEntrada = funcConcentracaoMediaCalculadaEntrada(TDSCalculatedFeed, vazaoPermeadoI, condutividadeEntradaI, vazaoEntradaI, TDSFeedI);
    // console.log(`Concentração Média de Entrada Calculada: ${concentracaoMediaCalculadaEntrada}`);
    
    function funcPressaoOsmoticaEntrada(pressaoEntradaI, temperaturaEntradaI, concentracaoMediaCalculadaEntrada) {
        if (pressaoEntradaI > 0 && temperaturaEntradaI > 0) {
            let pressaoOsmoticaEntradaI = 0.0385 * concentracaoMediaCalculadaEntrada * (temperaturaEntradaI + 273.15) / ((1000 - (concentracaoMediaCalculadaEntrada / 1000)) * 14.25);
            return pressaoOsmoticaEntradaI;
    
            //TODO; confirmar se tem o .015 (x)
        }
    
        if (pressaoEntradaI <= 0 || temperaturaEntradaI <= 0) {
            let pressaoOsmoticaEntradaI = 0
            return pressaoOsmoticaEntradaI
        }
    }
    
    let pressaoOsmoticaEntradaI = funcPressaoOsmoticaEntrada(pressaoEntradaI, temperaturaEntradaI, concentracaoMediaCalculadaEntrada);
    // console.log(`Pressão Osmotica de Entrada: ${pressaoOsmoticaEntradaI}`);
    
    function funcPressaoOsmoticaPermeado(pressaoEntradaI, condutividadePermeadoI, TDSCalculatedPermeado, TDSPermeado) {
    
        if (pressaoEntradaI <= 0) {
            let pressaoOsmoticaPermeado;
            return pressaoOsmoticaPermeado = 0;
        }
        if (pressaoEntradaI > 0 && condutividadePermeadoI > 0 && temperaturaEntradaI > 0) {
            let pressaoOsmoticaPermeado = ((0.0385 * TDSCalculatedPermeado * (temperaturaEntradaI + 273.15)) / (1000 - (TDSCalculatedPermeado / 1000))) / 14.25;
            return pressaoOsmoticaPermeado;
    
        }
        if (pressaoEntradaI > 0 && condutividadePermeadoI > 0 && temperaturaEntradaI <= 0) {
            let pressaoOsmoticaPermeado;
            return pressaoOsmoticaPermeado = 0;
        }
    
        if (pressaoEntradaI > 0 && condutividadePermeadoI <= 0) {
            if (TDSPermeado <= 0 || temperaturaEntradaI <= 0) {
                let pressaoOsmoticaPermeado;
                return pressaoOsmoticaPermeado = 0;
            } else {
                let pressaoOsmoticaPermeado = ((0.0385 * TDSPermeado * (temperaturaEntradaI + 273.15)) / (1000 - (TDSPermeado / 1000))) / 14.25;
                return pressaoOsmoticaPermeado;
            }
    
        }
    }
    
    let pressaoOsmoticaPermeado = funcPressaoOsmoticaPermeado(pressaoEntradaI, condutividadePermeadoI, TDSCalculatedPermeado, TDSPermeado);
    // console.log(`Pressâo Osmotica do Permeado: ${pressaoOsmoticaPermeado}`);
    
    function funcPressureNetDriving(pressaoEntradaI, pressaoDiferencialI, pressaoOsmoticaEntradaI, pressaoPermeadoI, pressaoOsmoticaPermeado) {
        let pressureNetDrivingI
    
        if (pressaoEntradaI > 0) {
            return pressureNetDrivingI = pressaoEntradaI - (pressaoDiferencialI / 2) - pressaoOsmoticaEntradaI - pressaoPermeadoI + pressaoOsmoticaPermeado; //TODO; confirmar variavel (x)
            
        }
        if (pressaoEntradaI <= 0) {
            return pressureNetDrivingI = 0;
        }
    }
    let pressureNetDrivingI = funcPressureNetDriving(pressaoEntradaI, pressaoDiferencialI, pressaoOsmoticaEntradaI, pressaoPermeadoI, pressaoOsmoticaPermeado);
    // console.log(`Pressure Net Driving: ${pressureNetDrivingI}`);
    
    function funcVazaoNormalizadaPermeado(vazaoPermeadoI, pressureNetDrivingZero, pressureNetDrivingI, correcaoTemperatura, correcaoTemperaturaZero) {
        let vazaoNormalizadaPermeado
        if (vazaoPermeadoI > 0) {
            return vazaoNormalizadaPermeado = (pressureNetDrivingZero * correcaoTemperaturaZero) / (pressureNetDrivingI * correcaoTemperatura) * vazaoPermeadoI;
          return vazaoNormalizadaPermeado = 5;
        }
        if (vazaoPermeadoI < 0) {
            return vazaoNormalizadaPermeado = 0;
        }
    }
    
    let vazaoNormalizadaPermeado = funcVazaoNormalizadaPermeado(vazaoPermeadoI, pressureNetDrivingZero, pressureNetDrivingI, correcaoTemperatura, correcaoTemperaturaZero);
    // console.log(`Vazão Normalizada do Permeado:${vazaoNormalizadaPermeado}`);
     
    function funcPassagemNormalizadaDeSalDoPermeado(vazaoPermeadoI,condutividadeEntradaI,TDSCalculatedPermeado, correcaoTemperaturaZero, concentracaoMediaCalculadaEntradaZero, vazaoPermeadoZero, TDSCalculatedFeedZero, concentracaoMediaCalculadaEntrada, TDSPermeado) {
        let PassagemNormalizadaDeSalDoPermeado;
        if (vazaoPermeadoI <= 0) {
            return PassagemNormalizadaDeSalDoPermeado = 0;
        }
        if (vazaoPermeadoI > 0 && condutividadeEntradaI > 0) {
            return PassagemNormalizadaDeSalDoPermeado = TDSCalculatedPermeado * vazaoPermeadoI * correcaoTemperaturaZero * concentracaoMediaCalculadaEntradaZero / (vazaoPermeadoZero * correcaoTemperatura * concentracaoMediaCalculadaEntrada * TDSCalculatedFeedZero) * 100;
        }
        if (vazaoPermeadoI > 0 && condutividadeEntradaI <= 0 && TDSFeedI > 0) {
            return PassagemNormalizadaDeSalDoPermeado = TDSPermeado * vazaoPermeadoI * correcaoTemperaturaZero * concentracaoMediaCalculadaEntradaZero / (vazaoPermeadoZero * correcaoTemperatura * concentracaoMediaCalculadaEntrada * TDSCalculatedFeedZero) * 100;
    
        }
        if (vazaoPermeadoI > 0 && condutividadeEntradaI <= 0 && TDSFeedI <= 0) {
            return PassagemNormalizadaDeSalDoPermeado = 0;
    
        }
    }
    
    let PassagemNormalizadaDeSalDoPermeado = funcPassagemNormalizadaDeSalDoPermeado(vazaoPermeadoI,condutividadeEntradaI,TDSCalculatedPermeado, correcaoTemperaturaZero, concentracaoMediaCalculadaEntradaZero, vazaoPermeadoZero, TDSCalculatedFeedZero,concentracaoMediaCalculadaEntrada, TDSPermeado);
    // console.log(`Passagem Normalizada de Sal: ${PassagemNormalizadaDeSalDoPermeado}`);
    
    function funcRejeicaoNormalizadaDeSalDoPermeado(vazaoPermeadoI, condutividadeEntradaI, PassagemNormalizadaDeSalDoPermeado, TDSFeedI) {
        let RejeicaoNormalizadaDeSalDoPermeado
        if (vazaoPermeadoI <= 0) {
            return RejeicaoNormalizadaDeSalDoPermeado = 0; 
        }
        if (vazaoPermeadoI > 0 && condutividadeEntradaI > 0) {
            return RejeicaoNormalizadaDeSalDoPermeado = 100 - PassagemNormalizadaDeSalDoPermeado; 
    
        }
        if (vazaoPermeadoI > 0 && condutividadeEntradaI <= 0 && TDSFeedI > 0) {
            return RejeicaoNormalizadaDeSalDoPermeado = 100 - PassagemNormalizadaDeSalDoPermeado; 
    
        }
        if (vazaoPermeadoI > 0 && condutividadeEntradaI <= 0 && TDSFeedI <= 0) {
            return RejeicaoNormalizadaDeSalDoPermeado = 0; 
    
        }
    }
    
    let RejeicaoNormalizadaDeSalDoPermeado = funcRejeicaoNormalizadaDeSalDoPermeado(vazaoPermeadoI, condutividadeEntradaI, PassagemNormalizadaDeSalDoPermeado, TDSFeedI);

      //if(pressaoDiferencialI!==undefined){
        // console.log(`${var1} ${var2} ${var3} ${var4} ${var5} ${var6} ${var7} ${var8} ${var9} ${var10} ${var11} ${formated_hour}`);
        //this.setState({
         // series: [pressaoDiferencialI.toFixed(1)],
       // });
      //}else{
       // this.setState({
        //  series: ["Valor não calculado"],
        //});
     // }

      //calculo do relativo
        function funcPressaoDiferencialRelativo(PressaoDiferencialRelativoZero,pressaoDiferencialI) {
            let PressaoDiferencialRelativo;
            return PressaoDiferencialRelativo = (1-pressaoDiferencialI/PressaoDiferencialRelativoZero)*100;
      }
        let PressaoDiferencialRelativo = funcPressaoDiferencialRelativo(PressaoDiferencialRelativoZero,pressaoDiferencialI);
    
        function funcRejeicaoSalRelativo(RejeicaoSalRelativoZero,RejeicaoNormalizadaDeSalDoPermeado) {
            let RejeicaoSalRelativo;
            return RejeicaoSalRelativo = (1-RejeicaoNormalizadaDeSalDoPermeado/RejeicaoSalRelativoZero)*100;
          }
        let RejeicaoSalRelativo = funcRejeicaoSalRelativo(RejeicaoSalRelativoZero,RejeicaoNormalizadaDeSalDoPermeado);
    
        function funcVazaoNormalizadaRelativo(VazaoNormalizadaRelativoZero,vazaoNormalizadaPermeado) {
            let VazaoNormalizadaRelativo;
            return VazaoNormalizadaRelativo = (1-vazaoNormalizadaPermeado/VazaoNormalizadaRelativoZero)*100;
          }
        let VazaoNormalizadaRelativo = funcVazaoNormalizadaRelativo(VazaoNormalizadaRelativoZero,vazaoNormalizadaPermeado);
    };
}

componentWillUnmount() {
    var me = this;
    me.ws.close();
}
  
render() {
    var me = this;
    //VazaoNormalizadaRelativo = me.state.vazaoNormalizadaPermeado + 20;
    // console.log(this.state);
    return (
        <div>
            <Container>
                <div style={me.state.style.custom_root}>
                    <div id="card_title">
                        <p>Vazão Normalizada, Rejeição de Sal e Pressão Diferencial Relativos</p>
                    </div>
                    <Grid container spacing={0.5} direction="row" justify="center" alignItems="center" style={me.state.style.custom_card}>
                        <Grid style={me.state.style.custom_center_item} item xs={12} sm={4}>
                            <Typography id='card_content'component="h2">
                                {me.state.VazaoNormalizadaRelativo}
                            </Typography>
                            <Typography>
                                %
                            </Typography>
                            <Typography id='card_desc' variant="body2" component="p" color="textSecondary">
                                <a href=" " style={me.state.style.custom_button}>Vazão Normalizada do Permeado</a>
                            </Typography>
                        </Grid>
                        <Grid style={me.state.style.custom_center_item} item xs={12} sm={4}>
                            <Typography id='card_content'component="h2">
                            {me.state.RejeicaoSalRelativo}
                            </Typography>
                            <Typography>
                                %
                            </Typography>
                            <Typography noWrap={true} id='card_desc' variant="body2" component="p" color="textSecondary"><a href=" "style={me.state.style.custom_button}>Rejeição Sal</a></Typography>
                        </Grid>
                        <Grid style={me.state.style.custom_center_item} item xs={12} sm={4}>
                            <Typography id='card_content'component="h2">
                            {me.state.PressaoDiferencialRelativo}

                            </Typography>
                            <Typography>
                                %
                            </Typography>
                            <Typography noWrap={true} id='card_desc' variant="body2" component="p" color="textSecondary">
                                <a href=" " style={me.state.style.custom_button}>Pressão Diferencial</a>
                            </Typography>
                        </Grid>
                    </Grid>
                </div>
            </Container>
        </div>
    );
}



}