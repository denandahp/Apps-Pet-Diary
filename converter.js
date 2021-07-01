var transformer = require('api-spec-transformer');

var postmanToSwagger = new transformer.Converter(transformer.Formats.POSTMAN, transformer.Formats.SWAGGER);

postmanToSwagger.loadFile("Pet_Diary.postman_collection", function(err) {
  if (err) {
    console.log(err.stack);
    return;
  }

  postmanToSwagger.convert('yaml')
    .then(function(convertedData) {
      // convertedData is swagger YAML string
      console.log(convertedData);
    })
    .catch(function(err){
      console.log(err);
    });
});