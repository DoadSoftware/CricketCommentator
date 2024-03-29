<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
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
  $(document).on("keydown", function(e){
	  processUserSelectionData('LOGGER_FORM_KEYPRESS',e.which);
  });
  	setInterval(() => {
  		processCricketProcedures('READ-MATCH-AND-POPULATE');		
	}, 1000);
  </script>
	
</head>
<body>
<form:form name="fruit_form" autocomplete="off" action="change_to_fruit" method="POST" enctype="multipart/form-data">
<div class="content py-8" style="background-color: #EAE8FF; color: #2E008B">
	<div class="row ; text-nowrap" style="height:100% width: 100% ;">
	 <div class="col-xl">
       <span class="anchor"></span>
          <div class="card-body">
			  <div id="fruit_captions_div" class="form-group row row-bottom-margin ml-2 " style="height:50% width: 50%;">
			  </div>
	       </div>
       </div>
    </div>
</div>
</form:form>
<input type="hidden" id="matchFileTimeStamp" name="matchFileTimeStamp" value="${session_match.setup.matchFileTimeStamp}"></input>
<input type="hidden" id="select_page" name="select_page" value="${session_selected_page}"></input>
</body>
</html>