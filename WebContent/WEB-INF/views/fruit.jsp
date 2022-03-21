<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>

  <meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1">
  <title>Output Screen</title>
	
  <script type="text/javascript" src="<c:url value="/webjars/jquery/3.6.0/jquery.min.js"/>"></script>
  <script type="text/javascript" src="<c:url value="/webjars/bootstrap/5.1.3/js/bootstrap.min.js"/>"></script>
  <script type="text/javascript" src="<c:url value="/resources/javascript/index.js"/>"></script>
  
  <link rel="stylesheet" href="<c:url value="/webjars/bootstrap/5.1.3/css/bootstrap.min.css"/>"/>  
  <link href="<c:url value="/webjars/font-awesome/6.0.0/css/all.css"/>" rel="stylesheet">
	
  <script type="text/javascript">
  	setInterval(() => {
  		processCricketProcedures('READ-MATCH-AND-POPULATE');		
	}, 1000);
  </script>
	
</head>
<body>
<div class="content py-5" style="background-color: #EAE8FF; color: #2E008B">
  <div class="container">
	<div class="row">
	 <div class="col-md-8 offset-md-2">
       <span class="anchor"></span>
         <div class="card card-outline-secondary">
           <div class="card-header">
             <h3 class="mb-0">Fruit Machine</h3>
           </div>
          <div class="card-body">
			  <div id="fruit_captions_div" class="form-group row row-bottom-margin ml-2" style="margin-bottom:5px;">
			  </div>
	       </div>
	    </div>
       </div>
    </div>
  </div>
</div>
<input type="hidden" id="match_file_timestamp" name="match_file_timestamp" value="${session_match.match_file_timestamp}"></input>
</body>
</html>