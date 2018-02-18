
 var first_name = '' ;
 var url = "";

function initMetaDataSection(url){

    Plotly.d3.json(url, function(error, response) {
   
        // console.log(response);
   
        if (error) return console.warn(error);

        console.log(response[0]);
   
    
    });

}

function init(){
   
    Plotly.d3.json("/names", function(error, response) {
   
        // console.log(response);
       
        if (error) return console.warn(error);

       
        // document.write(JSON.stringify(response))

        Plotly.d3.select("#selDataset").selectAll("option").data(response).enter().
                append('option').text(response => response);
    

       url = "/metadata/" + response[0];

        console.log(url);

        initMetaDataSection(url);

        // Plotly.d3.json(url, function(error, response) {
   
        //     // console.log(response);
       
        //     if (error) return console.warn(error);

       

        //     console.log(response);
       
        
        // });
        
     });

   

     
     
     

  
  
  
}



function optionChanged(data){
    console.log(data);
    
}

init();



// console.log('Hello');
// console.log( Plotly.d3.select("#selDataset").node().value);
// var e = document.getElementById("selDataset");
// var strUser = e.options[0].text;
// console.log(strUser);


