\documentclass[11pt]{article}
\title{Exercices - n<%- id %> }
\usepackage{etex}
\usepackage[french]{babel}
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage[dvipsnames]{xcolor}
\usepackage{amsmath,amssymb}
\usepackage{multicol}
\usepackage[top=1.5cm, bottom=2cm, left=1.8cm, right=1.8cm]{geometry}
%------entêtes------------------------
\usepackage{fancyhdr}
\usepackage{lastpage}
\chead{Exercices - <%- nom %> - n<%- id %> }
\lhead{}
\rhead{}
\renewcommand{\headrulewidth}{0.5mm}
\renewcommand{\footrulewidth}{0.5mm}
\cfoot{Page \thepage /\pageref{LastPage}}
\pagestyle{fancy}
%--------------------------------------
\usepackage{pstricks-add} % tracé de courbes
\usepackage{tikz}
\usepackage{tkz-tab}
\usetikzlibrary{arrows}
\usepackage{enumerate}
\usepackage{fancybox} % Pour les encadrés
\usepackage{gensymb}

\newcounter{numexo} %Création d'un compteur qui s'appelle numexo
\setcounter{numexo}{0} %initialisation du compteur
\newcommand{\exercice}[1]{
	\addtocounter{numexo}{1}
	\setlength {\fboxrule }{1pt}
	\vspace{5mm}
	\hspace{-1cm}\fcolorbox{black}{black!10}{\textbf{Exo \,\thenumexo\,} }\hspace{5mm}#1
	\vspace{5mm}
}

\frenchbsetup{StandardItemLabels=true} % bullets pour les items
\newcommand{\D}{\mathcal{D}}
\newcommand{\R}{\mathbb{R}}
\begin{document}
\raggedcolumns
\begin{multicols}{2}
<%
	var letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var recursive_fct = function(el, index){
		if((typeof el == "object")&&(el!==null)){
			switch (el.type){
				case "multicols" : %>
\begin{multicols}{<%- el.cols %>}
<%					_.each(el.children,recursive_fct); %>
\end{multicols}
<%					break;
				case "enumerate": %>
\begin{enumerate}<%if (el.tag){%>[<%-el.tag %>]<% } %>
<% _.each(el.children, function(it, index){ %>\item <%recursive_fct(it, index); }); %>
\end{enumerate}
<%			}
		} else if (typeof el == "string") { %>
<%= el %>
<%		}
	}

	var fct = function(item){ %>

\exercice{<%-item.title%>}

<% if (item.message) {%><%- item.message %>
<% }
		_.each(item.children, recursive_fct);
	}

	_.each(exercices, fct);
%>
\end{multicols}
\end{document}
