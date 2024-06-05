// This is the Sentinel-2 collection (all the possible available Sentinel 2 imagery)
var S2_collection = ee.ImageCollection("COPERNICUS/S2")
.filterDate('2022-01-01','2022-01-30')
.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20))
.filterBounds(geometry)
.median();
var visParamsTrue={bands: ['B4','B3','B2'], min: 0, max: 5000,gamma:1.1};
Map.addLayer(S2_collection.clip(geometry),visParamsTrue,'sentinel-2020');
Map.centerObject(geometry,8); 
//Create Training Data
var training=water.merge(forest).merge(crops).merge(urban);
print(training);
var label='Class'
var bands=['B2','B3','B4','B8'];
var input=S2_collection.select(bands);

var trainImage=input.sampleRegions({
  collection: training,
  properties: [label],
  scale:30
});
 var trainingData=trainImage.randomColumn();
 var trainSet=trainingData.filter(ee.Filter.lessThan('random',0.8));
 var testSet=trainingData.filter(ee.Filter.greaterThanOrEquals('random',0.8));
 
 var classifier=ee.Classifier.smileCart().train(trainSet,label,bands);
 var classifier1=ee.Classifier.smileNaiveBayes().train(trainSet,label,bands);
 var classifier2=ee.Classifier.libsvm().train(trainSet,label,bands);
 //var classifier3=ee.Classifier.smileRandomForest().train(trainSet,label,bands);
 var classified=input.classify(classifier);
 var classified1=input.classify(classifier1);
 var classified2=input.classify(classifier2);
 
 var landcoverpallete=[
   '253494',//water (0)
   '006837',//forest(1)
   '#FFFF00',//barren(2)
   '#FF00FF',//urban(3)
   ];
   Map.addLayer(classified.clip(geometry),{palette:landcoverpallete, min:0,max:4},'Classification CART');
   Map.addLayer(classified1.clip(geometry),{palette:landcoverpallete, min:0,max:4},'NaiveBayes');
   Map.addLayer(classified2.clip(geometry),{palette:landcoverpallete, min:0,max:4},'SVM');
   // accuracy assessment
   var confusionMatrix=ee.ConfusionMatrix(testSet.classify(classifier)
   .errorMatrix({
     actual:'Class',
     predicted:'classification'
     
   }));
   var confusionMatrix1=ee.ConfusionMatrix(testSet.classify(classifier1)
   .errorMatrix({
     actual:'Class',
     predicted:'classification'
     
   }));
   var confusionMatrix2=ee.ConfusionMatrix(testSet.classify(classifier2)
   .errorMatrix({
     actual:'Class',
     predicted:'classification'
     
   }));
   print('Confusion matrix CART:',confusionMatrix);
   print('Overall Accuracy CART:',confusionMatrix.accuracy());
    print('Confusion matrix NaiveBayes:',confusionMatrix1);
   print('Overall Accuracy NaiveBayes:',confusionMatrix1.accuracy());
   print('Confusion matrix SVM:',confusionMatrix2);
   print('Overall Accuracy SVM:',confusionMatrix2.accuracy());
  // Export.image.toDrive({
  //   image:classified,
  //   description:"Sentinel_2_CART_2018",
  //   scale:10,
  //   region:geometry,
  //   maxPixels:1e13,
  // });
  var S22018_collection = ee.ImageCollection("COPERNICUS/S2")
.filterDate('2018-01-01','2018-01-30')
.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20))
.filterBounds(geometry)
.median();
var visParamsTrue={bands: ['B4','B3','B2'], min: 0, max: 5000,gamma:1.1};
Map.addLayer(S22018_collection.clip(geometry),visParamsTrue,'sentinel-2020');
Map.centerObject(geometry,8);
//Create Training Data
var training=water.merge(forest).merge(crops).merge(urban);
print(training);
var label='Class'
var bands=['B2','B3','B4','B8'];
var input=S22018_collection.select(bands);

var trainImage=input.sampleRegions({
  collection: training,
  properties: [label],
  scale:30
});
 var trainingData1=trainImage.randomColumn();
 var trainSet1=trainingData1.filter(ee.Filter.lessThan('random',0.8));
 var testSet1=trainingData1.filter(ee.Filter.greaterThanOrEquals('random',0.8));
 
 var classifier1=ee.Classifier.smileCart().train(trainSet1,label,bands);
 var classifier11=ee.Classifier.smileNaiveBayes().train(trainSet1,label,bands);
 var classifier21=ee.Classifier.libsvm().train(trainSet1,label,bands);
 //var classifier3=ee.Classifier.smileRandomForest().train(trainSet,label,bands);
 var classified1=input.classify(classifier1);
 var classified11=input.classify(classifier11);
 var classified21=input.classify(classifier21);
 
 var landcoverpallete=[
   '253494',//water (0)
   '006837',//urban(1)
   '#FFFF00',//forest(2)
   '#FF00FF',//crops(3)
   ];
   Map.addLayer(classified1.clip(geometry),{palette:landcoverpallete, min:0,max:4},'CART-2018');
   Map.addLayer(classified11.clip(geometry),{palette:landcoverpallete, min:0,max:4},'NaiveBayes-2018');
   Map.addLayer(classified21.clip(geometry),{palette:landcoverpallete, min:0,max:4},'SVM-2018');
   // accuracy assessment
   var confusionMatrix2018=ee.ConfusionMatrix(testSet1.classify(classifier1)
   .errorMatrix({
     actual:'Class',
     predicted:'classification'
     
   }));
   var confusionMatrix20181=ee.ConfusionMatrix(testSet1.classify(classifier11)
   .errorMatrix({
     actual:'Class',
     predicted:'classification'
     
   }));
   var confusionMatrix20182=ee.ConfusionMatrix(testSet1.classify(classifier21)
   .errorMatrix({
     actual:'Class',
     predicted:'classification'
     
   }));
   print('Confusion matrix CART:',confusionMatrix2018);
   print('Overall Accuracy 2018-CART:',confusionMatrix2018.accuracy());
    print('Confusion matrix NaiveBayes:',confusionMatrix20181);
   print('Overall Accuracy 2018-naivebayes:',confusionMatrix20181.accuracy());
   print('Confusion matrix: SVM',confusionMatrix20182);
   print('Overall Accuracy 2018-SVM:',confusionMatrix20182.accuracy());
   
   var result=classified2.subtract(classified21);
   Map.addLayer(result.clip(geometry),{palette:landcoverpallete, min:0,max:4},'result');
   
// Create masks for 'crop1' and 'crop2' in 2018
var ForestMask2018 = classified1.eq(2); // Assuming class 2 represents 'crop1'
var CropMask2018 = classified1.eq(3); // Assuming class 3 represents 'crop2'

// Create masks for 'crop1' and 'crop2' in 2020
var ForestMask2020 = classified2.eq(2); // Assuming class 2 represents 'crop1'
var CropMask2020 = classified2.eq(3); // Assuming class 3 represents 'crop2'

// Calculate the area of 'crop1' and 'crop2' in 2018 and 2020
var areaForest_2018 = ForestMask2018.multiply(ee.Image.pixelArea()).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: geometry, // Assuming 'geometry' represents your region of interest
  scale: 30, // Assuming a scale of 30 meters
  maxPixels: 1e12 // Maximum number of pixels to reduce
});

var areaCrop_2018 = CropMask2018.multiply(ee.Image.pixelArea()).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: geometry,
  scale: 30,
  maxPixels: 1e12
});

var areaForest_2020 = ForestMask2020.multiply(ee.Image.pixelArea()).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: geometry,
  scale: 30,
  maxPixels: 1e12
});

var areaCrop_2020 = CropMask2020.multiply(ee.Image.pixelArea()).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: geometry,
  scale: 30,
  maxPixels: 1e12
});


// Print the area results
print('Area of Forest in 2018:', areaForest_2018.get('classification'),'Square metres');
print('Area of Crop in 2018:', areaCrop_2018.get('classification'),'Square metres');
print('Area of Forest in 2022:', areaForest_2020.get('classification'),'Square metres');
print('Area of Crop in 2022:', areaCrop_2020.get('classification'),'Square metres');
// Assuming you have already calculated the areas as shown in the previous code

// Calculate the percentage change for FOREST and Crop between 2018 and 2020
var percentageChangeForest = ee.Number(areaForest_2020.get('classification'))
  .subtract(ee.Number(areaForest_2018.get('classification')))
  .divide(ee.Number(areaForest_2018.get('classification')))
  .multiply(100);

var percentageChangeCrop = ee.Number(areaCrop_2020.get('classification'))
  .subtract(ee.Number(areaForest_2018.get('classification')))
  .divide(ee.Number(areaCrop_2018.get('classification')))
  .multiply(100);

// Print the percentage change results
print('Percentage Change in Forest:', percentageChangeForest, '%');
print('Percentage Change in Crop:', percentageChangeCrop, '%');
// Assuming you have already created masks for urban and water in 2018 and 2020
var urbanMask2018 = classified2.eq(1); // Assuming class 2 represents 'FOREST'
var urbanMask2020 = classified2.eq(1); // Assuming class 2 represents 'CROP'
// Calculate the total area of "urban" and "water" in 2018 and 2020
var totalUrbanArea2018 = urbanMask2018.multiply(ee.Image.pixelArea()).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: geometry,
  scale: 30,
  maxPixels: 1e12
}).values().get(0);

var totalUrbanArea2020 = urbanMask2020.multiply(ee.Image.pixelArea()).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: geometry,
  scale: 30,
  maxPixels: 1e12
}).values().get(0);

// Calculate the percentage change for "urban" and "water" areas
var percentageChangeUrban = ee.Number(totalUrbanArea2020)
  .subtract(ee.Number(totalUrbanArea2018))
  .divide(ee.Number(totalUrbanArea2018))
  .multiply(100);

// Print the percentage change results
print('Percentage Change in Other Area:', percentageChangeUrban, '%');


   //////////////////////////////////////////////////////////////////////////////////////////////
///
//////////////////////////////////////////////////////////////////////////////////////////


// Load the classified maps for 2017 and 2022
var classifiedMap2018= classified2;
var classifiedMap2023 = classified21;


// Create binary masks for each class in the 2017 classified map
var classMaskWater2018 = classifiedMap2018.eq(0); // Class 0 (Water) in 2017
var classMaskForest2018 = classifiedMap2018.eq(1); // Class 1 (Forest) in 2017
var classMaskBarren2018 = classifiedMap2018.eq(2); // Class 2 (Barren) in 2017
var classMaskUrban2018 = classifiedMap2018.eq(3); // Class 3 (Urban) in 2017

// Calculate the transition matrix by comparing land cover classes between 2017 and 2022
var transitionMatrix = ee.Image([
  
  classMaskWater2018.multiply(classifiedMap2023.eq(0)).rename('water_water'),

  classMaskWater2018.multiply(classifiedMap2023.eq(1)).rename('water_urban'),

  classMaskWater2018.multiply(classifiedMap2023.eq(2)).rename('water_forest'),

  classMaskWater2018.multiply(classifiedMap2023.eq(3)).rename('water_crops'),

  classMaskForest2018.multiply(classifiedMap2023.eq(0)).rename('urban_water'),
  
  classMaskForest2018.multiply(classifiedMap2023.eq(1)).rename('urban_urban'),

  classMaskForest2018.multiply(classifiedMap2023.eq(2)).rename('urban_forest'),
  
  classMaskForest2018.multiply(classifiedMap2023.eq(3)).rename('urban_crops'),

  classMaskBarren2018.multiply(classifiedMap2023.eq(0)).rename('forest_water'),

  classMaskBarren2018.multiply(classifiedMap2023.eq(1)).rename('forest_urban'),

  classMaskBarren2018.multiply(classifiedMap2023.eq(2)).rename('forest_forest'),

  classMaskBarren2018.multiply(classifiedMap2023.eq(3)).rename('forest_crops'),

  classMaskUrban2018.multiply(classifiedMap2023.eq(0)).rename('crops_water'),

  classMaskUrban2018.multiply(classifiedMap2023.eq(1)).rename('crops_urban'),

  classMaskUrban2018.multiply(classifiedMap2023.eq(2)).rename('crops_forest'),

  classMaskUrban2018.multiply(classifiedMap2023.eq(3)).rename('crops_crops')
]);

// Sum the values to get transition counts
var transitionCounts = transitionMatrix.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: geometry,
  scale: 30,
  maxPixels: 1e9
});

// Print the transition counts
print('Transition Counts:', transitionCounts);
