<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>

  <meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1">
  <title>Initialise Screen</title>

  <script type="text/javascript" src="<c:url value="/webjars/jquery/3.6.0/jquery.min.js"/>"></script>
  <script type="text/javascript" src="<c:url value="/webjars/bootstrap/5.1.3/js/bootstrap.min.js"/>"></script>
  <script type="text/javascript" src="<c:url value="/resources/javascript/index.js"/>"></script>
  
  <link rel="stylesheet" href="<c:url value="/webjars/bootstrap/5.1.3/css/bootstrap.min.css"/>"/>  
  <link href="<c:url value="/webjars/font-awesome/6.0.0/css/all.css"/>" rel="stylesheet">
		
</head>
<body>
<form:form name="initialise_form" autocomplete="off" action="commentator" method="POST" enctype="multipart/form-data">
<div class="content py-5" style="background-color: #EAE8FF; color: #2E008B">
  <div class="container">
	<div class="row">
	 <div class="col-md-8 offset-md-2">
       <span class="anchor"></span>
         <div class="card card-outline-secondary">
           <div class="card-header">
             <h3 class="mb-0">Initialise</h3>
           </div>
          <div class="card-body">
			  <div class="form-group row row-bottom-margin ml-2" style="margin-bottom:5px;">
			    <label for="select_cricket_matches" class="col-sm-4 col-form-label text-left">Select Cricket Match </label>
			    <div class="col-sm-6 col-md-6">
			      <select id="select_cricket_matches" name="select_cricket_matches" 
			      		class="browser-default custom-select custom-select-sm" onchange="processCricketProcedures('CHECK-NUMBER-INNINGS')">
						<c:forEach items = "${match_files}" var = "match">
				          	<option value="${match.name}">${match.name}</option>
						</c:forEach>
			      </select>
			    </div>
			  </div>
			  <div class="form-group row row-bottom-margin ml-2" style="margin-bottom:5px;">
			    <label for="select_broadcaster" class="col-sm-4 col-form-label text-left">Select Broadcaster </label>
			    <div class="col-sm-6 col-md-6">
			      <select id="select_broadcaster" name="select_broadcaster" class="browser-default custom-select custom-select-sm">
			          <option value="doad">DOAD In House</option>
			      </select>
			    </div>
			  </div>
			  <div class="form-group row row-bottom-margin ml-2" style="margin-bottom:5px;">
			    <label for="select_page" class="col-sm-4 col-form-label text-left">Select Page </label>
			    <div class="col-sm-6 col-md-6">
			      <select id="select_page" name="select_page" class="browser-default custom-select custom-select-sm">
			          <option value="ident">Ident</option>
			          <option value="teams">Double Teams</option>
			          <option value="fruit">Fruit</option>
			      </select>
			    </div>
			  </div>
		    <button style="background-color:#2E008B;color:#FEFEFE;" class="btn btn-sm" type="submit"
		  		name="load_fruit_btn" id="load_fruit_btn" action ="commentator" method="POST">
		  		<i class="fa-solid fa-microphone"></i> Load Commentator</button>
	       </div>
	    </div>
       </div>
    </div>
  </div>
</div>
</form:form>
<input type="hidden" id="select_page" name="select_page" value="${session_selected_page}"></input>
</body>
</html>