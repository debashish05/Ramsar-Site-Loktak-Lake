var image = L8T1.filterBounds(roi)
            .filterDate('2021-02-01','2022-04-01')
            .filterMetadata('CLOUD_COVER','less_than',1)
            .mean()
            .clip(roi)
Map.addLayer(image, {bands:['B4','B3','B2']},'TrueColor');
print(image);
//Merge into one FeatureCollection and print details to consloe
var classNames = tWater.merge(tUrban).merge(tVegetation).merge(tBareland);
print(classNames);

//Extract training data from select bands of the image, print to console
var bands = ['B2', 'B3', 'B4', 'B5', 'B6', 'B7'];
var training = image.select(bands).sampleRegions({
  collection: classNames,
  properties: ['landcover'],
  scale: 30
});
print(training);


//Train classifier - e.g. cart, randomForest, svm
var classifier = ee.Classifier.smileCart().train({
  features: training,
  classProperty: 'landcover',
  inputProperties: bands
});

//Run the classification
var classified = image.select(bands).classify(classifier);

//Centre the map on your training data coverage
Map.centerObject(classNames, 11);
//Add the classification to the map view, specify colours for classes
Map.addLayer(classified,
{min: 0, max: 3, palette: ['0000FF', 'FF0000', '008000','FFFF00']},
'classification');

Export.image.toDrive({
  image:classified,
  description:'LULCCHAGLAIN',
  scale:30,
  region:roi
})

// set position of panel
var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px'
  }
});
 
// Create legend title
var legendTitle = ui.Label({
  value: 'Classification',
  style: {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '0 0 4px 0',
    padding: '0'
    }
});
 
// Add the title to the panel
legend.add(legendTitle);
 
// Creates and styles 1 row of the legend.
var makeRow = function(color, name) {
 
      // Create the label that is actually the colored box.
      var colorBox = ui.Label({
        style: {
          backgroundColor: '#' + color,
          // Use padding to give the box height and width.
          padding: '8px',
          margin: '0 0 4px 0'
        }
      });
 
      // Create the label filled with the description text.
      var description = ui.Label({
        value: name,
        style: {margin: '0 0 4px 6px'}
      });
 
      // return the panel
      return ui.Panel({
        widgets: [colorBox, description],
        layout: ui.Panel.Layout.Flow('horizontal')
      });
};
 
//  Palette with the colors
var palette =['0000FF', 'FF0000', '008000','FFFF00'];
 
// name of the legend
var names = ['Water body','BuiltUp Area','Vegetation', 'Bare Land'];
 
// Add color and and names
for (var i = 0; i < 4; i++) {
  legend.add(makeRow(palette[i], names[i]));
  }  
 
// add legend to map (alternatively you can also print the legend to the console)
Map.add(legend);

// Create the title label.
var title = ui.Label('Land Cover Landuse Classification Map of Loktak Lake 2022');
title.style().set('position', 'top-center');
Map.add(title);

