var geometry = 
    /* color: #fdffec */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[93.74752341723332, 24.600323192461445],
          [93.74752341723332, 24.47039707856406],
          [93.87111960863957, 24.47039707856406],
          [93.87111960863957, 24.600323192461445]]], null, false);

var maskClouds = function(image){
    var score = ee.Algorithms.Landsat.simpleCloudScore(image).select('cloud');
    var mask=score.lt(10);
    return image.updateMask(mask);
  }
  
  var landsat = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
                  .map(maskClouds);
  var image = ee.Image(
    landsat.filterBounds(geometry)
           .filterDate('2021-06-01', '2021-08-31')
           .median()
  );
  // 1. Clip the image in a specified boundary.
  var composite = image.clip(geometry);
  var composite = composite.toFloat()
  // Add map layers
  Map.addLayer(composite , {bands: ['B6', 'B5', 'B4']}, "composite", false);
  
  
  var nir = image.select('B5');
  var red = image.select('B4');
  var ndvi = nir.subtract(red).divide(nir.add(red));
  var ndvi = ndvi.clip(geometry);
  // Add map layers
  Map.addLayer(ndvi, {min: 0, max: 1, palette: ['black', 'yellow', 'green']}, 'continuous NDVI',false);
  
  var mean_ndvi = ndvi.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: geometry,
    scale: 30
  });
  var sd_ndvi = ndvi.reduceRegion({
    reducer: ee.Reducer.stdDev(),
    geometry: geometry,
    scale: 30
  });
  print(mean_ndvi);
  print(sd_ndvi);
  
  var ndvi2 = ee.Image(1)
            
            .where(ndvi.gt(0.0).and(ndvi.lte(0.2)), 2)
            .where(ndvi.gt(0.2).and(ndvi.lte(0.4)), 3)
            .where(ndvi.gt(0.4).and(ndvi.lte(0.6)), 4)
            .where(ndvi.gt(0.6), 5)
  
  var ndvi2 = ndvi2.clip(geometry);
  // Add map layers
  Map.addLayer(ndvi2, {min: 1, max: 5, palette: ['#654321','#FFA500','#FFFF00', '#00FF00', '#008000']}, 'Classified NDVI',true);
  
  
  
  // Add map title
  var mapTitle = ui.Panel({
    style: {
      position: 'top-center',
      padding: '8px 15px'
    }
  });
  var mapTitle2 = ui.Label({
    value: 'LOKTAK',
    style: {
      fontWeight: 'bold',
      fontSize: '20px',
      margin: '0 0 3px 0',
      padding: '0'
      }
  });
  mapTitle.add(mapTitle2);
  Map.add(mapTitle);
  // Add map legend
  var legend = ui.Panel({
    style: {
      position: 'bottom-right',
      padding: '8px 15px'
    }
  });
  var legend2 = ui.Label({
    value: 'Legend (NDVI)',
    style: {
      fontWeight: 'bold',
      fontSize: '18px',
      margin: '0 0 4px 0',
      padding: '0'
      }
  });
  legend.add(legend2);
  // Creates the content of the legend
  var content = function(color, label) {
        // Create the color boxes
        var box = ui.Label({
          style: {
            backgroundColor: '#' + color,
            // Set box height and width
            padding: '9px',
            margin: '0 0 4px 0'
          }
        });
        // Create the labels
        var labels = ui.Label({
          value: label,
          style: {margin: '0 0 4px 6px'}
        });
        return ui.Panel({
          widgets: [box, labels],
          layout: ui.Panel.Layout.Flow('horizontal')
        });
  };
  //  Set legend colors
  var classcolor = ['654321','FFA500','FFFF00', '00FF00', '008000'];
  // Set legend labels
  var labelName = ['<=0','0 - 0.2','0.2 - 0.4','0.4 - 0.6', '>0.6'];
  // Combine legend colou and labels
  for (var i = 0; i < 5; i++) {
    legend.add(content(classcolor[i], labelName[i]));
    }  
  // Add legend
  Map.add(legend);
  


  var startDate = '2013-01-01';
  var endDate = '2022-01-01';
  
  // Map.addLayer(geometry, {}, "Loktak");
  // Map.centerObject(geometry)
  
                             
  var SFCCvis = {bands: ['B5', 'B4', 'B3'], min: 0, max:0.3, gamma:1.3};
  var Indexvis = {min: -1.0, max: 1.0, pallete:['blue', '#FFF233','#e6e600','#33cc33','#00802b']};
  
  var landsat = ee.ImageCollection("LANDSAT/LC08/C02/T1_TOA")
                  .filterDate(startDate, endDate)
                  
                  .filterBounds(geometry)
                  
  
  var landsat_list = landsat.toList(landsat.size());
  
  print(landsat_list);
  var image_collection = ee.ImageCollection([
            ee.Image(landsat_list.get(0)),
            ee.Image(landsat_list.get(3)),
            ee.Image(landsat_list.get(6)),
            ee.Image(landsat_list.get(10)),
            ee.Image(landsat_list.get(13)),
            ee.Image(landsat_list.get(16)),
            ee.Image(landsat_list.get(20)),
            ee.Image(landsat_list.get(23)),
            ee.Image(landsat_list.get(26)),
            ee.Image(landsat_list.get(30)),
            ee.Image(landsat_list.get(33)),
            ee.Image(landsat_list.get(36)),
            ee.Image(landsat_list.get(40)),
            ee.Image(landsat_list.get(43)),
            ee.Image(landsat_list.get(46)),
            ee.Image(landsat_list.get(50)),
            ee.Image(landsat_list.get(53)),
            ee.Image(landsat_list.get(56)),
            ee.Image(landsat_list.get(60)),
            ee.Image(landsat_list.get(63)),
            ee.Image(landsat_list.get(66)),
            ee.Image(landsat_list.get(70)),
            // ee.Image(landsat_list.get(74)),
            ee.Image(landsat_list.get(76)),
            ee.Image(landsat_list.get(80)),
            ee.Image(landsat_list.get(83)),
            ee.Image(landsat_list.get(86)),
            ee.Image(landsat_list.get(90)),
            ee.Image(landsat_list.get(93)),
            ee.Image(landsat_list.get(96)),
            ee.Image(landsat_list.get(100)),
            ee.Image(landsat_list.get(103)),
            ee.Image(landsat_list.get(106)),
            ee.Image(landsat_list.get(110)),
            ee.Image(landsat_list.get(116)),
            ee.Image(landsat_list.get(120)),
            ee.Image(landsat_list.get(123)),
            ee.Image(landsat_list.get(126)),
            ee.Image(landsat_list.get(129)),
            ee.Image(landsat_list.get(130)),
            
            ee.Image(landsat_list.get(135)),
            ee.Image(landsat_list.get(140)),
            ee.Image(landsat_list.get(143)),
            ee.Image(landsat_list.get(146)),
            ee.Image(landsat_list.get(150)),
            ee.Image(landsat_list.get(156)),
            ee.Image(landsat_list.get(160)),
            
            ]);
  print(image_collection);
  
  var addNDVI = function(image){
    return image
          .addBands(image.expression('(b("B5")-b("B4"))/(b("B5")+b("B4"))')
          .rename('ndvi'))
          .float();
    
  };
  
image_collection=image_collection.map(maskClouds);

var c_landsat = landsat.map(maskClouds);
var c_landsat_list = c_landsat.toList(c_landsat.size())
var img1 = ee.Image(landsat_list.get(10)).clip(geometry).toFloat();

Map.addLayer(img1, SFCCvis, 'image Layer');
var NDVI_img1 = img1.normalizedDifference(['B5', 'B4']).clip(geometry);
Map.addLayer(NDVI_img1, Indexvis, 'NDVI Layer');
// print(img1);

var NDVI = image_collection.map(addNDVI);
var NDVI_f = NDVI.select('ndvi');
print(NDVI_f);

var chart = ui.Chart.image.series({
    imageCollection: NDVI_f,
    region: geometry,
    reducer: ee.Reducer.mean(),
    scale: 30,
  })
  .setChartType('ScatterChart')
    .setOptions({
      title: 'Time series',
      vAxis: {title:'NDVI value'},
      lineWidth: 2,
      pointSize: 5,
      series: {
        0: {color: 'green'},
      }
    });
    
    chart.style().set({
      position: 'bottom-left',
      width:'400px',
      height:'200px',
      
    });
    Map.add(chart);

  // Export and save to drive
  Export.image.toDrive({
    image: ndvi2,
    description: 'classifiedNDVI',
    scale: 30,
    fileFormat: 'GeoTIFF',
    region: geometry
  });
  Export.image.toDrive({
    image: ndvi,
    description: 'continuousNDVI',
    scale: 30,
    fileFormat: 'GeoTIFF',
    region: geometry
  });
  Export.image.toDrive({
    image: composite,
    description: 'Composite654',
    scale: 30,
    fileFormat: 'GeoTIFF',
    region: geometry
  });