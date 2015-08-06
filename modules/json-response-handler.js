
function sendResponse(res,err,result,failureMessage){

	if(err !==null){
		console.log(err);
			res.send({ status: 'error', message: err });
		}else{
			if(result === 1){
				res.send({ status: 'success'});
			}else{
				console.log("Failure: "+failureMessage);
				res.send({ status: 'failure',message:failureMessage});
		}
	}
}	

module.exports.sendResponse = sendResponse;		