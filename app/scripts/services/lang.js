'use strict';

function Lang($routeParams) {
  var langs = ['en', 'fr'];
  // var lang = $routeParams.lang;
  self.defaultLang = "en";

  var langDict = {
  	en:{
      academic:"Academic",
  		academic_year:"Academic Year",
      access_denied:"Access Denied",
  		add:"Add",
  		add_class:"Add Class",
      add_student:"Add Student", 
      all:"All",
      all_forms:"All Forms",
      all_terms:"All Terms",
      all_departments:"All Departments",
      all_fees:"All Fees",
      all_groups:"All Groups",
      annual_results:"Annual Results",
      average:"Average",
      beginning_of_year:"Beginning of Year",
      best_performances:"Best Performances",
  		cancel:"Cancel",
      caps_lock_is_on:"Caps Lock is on.",
  		Class:"Class",
      classmaster:"Class Master/Mistress",
      class_average:"Class Average",
      class_name:"Class Name",
      class_range:"Class Range",
      clear_all:"Clear All", //wrong
  		code:"Code",
      conduct:"Conduct",
      date:"Date",
  		date_of_birth:"Date of Birth",
  		department_name:"Department Name",
      dept:"Dept",
      dismissed:"Dismissed",
  		edit_student:"Edit Student",
      end_of_year:"End of Year",
      english:"English",
      enrolled:"Enrolled",
      enrollment:"Enrollment",
      enrollment_statistics:"Enrollment Statistics",
      enter_name:"Enter name",
      exporting:"Exporting",
      export_file:"Export to File",
      export_statistics:"Export Statistics",
      fail:"Fail",
      fee:"Fee",
      fees:"Fees",
      fee_due:"Fee Due",
  		fee_group:"Fee Group",
      fee_name:"Fee Name",
      female:"Female",
      file:"File",
      filter:"Filter",
      form:"Form",
      french:"French",
  		full_name:"Full Name",
      good:"Good",
      head_of_department:"Head of Department",
      high:"High",
      importing:"Importing",
      import_file:"Import File",
      incorrect_password:"Incorrect Password",
      language:"Language",
      loading:"Loading",
      logout:"Logout",
      low:"Low",
      male:"Male",
      move:"Move",
  		name:"Name",
      no_remark:"No Remark",
      number:"Number",
      number_enrolled:"Number Enrolled",
      number_present:"Number Present",
      number_with:"Number with",
  		parent_email:"Parent Email",
  		parent_name:"Parent Name",
  		parent_occupation:"Parent Occupation",
  		parent_phone:"Parent Phone",
      pass:"Pass",
      passing_score:"Passing Score",
      password:"Password",
      percent_failing:"Percentage Fail",
      percent_passing:"Percentage Pass",
      performance_by_subject:"Performance by Subject",
  		place_of_birth:"Place of Birth",
      please_fill_in_all_fields:"Please fill in all fields highlighted in red and try again.",
      poor:"Poor",
      possible_factors:"Possible Factors",
      present:"Present",
      print:"Print",
      print_all_report_cards:"Print All Report Cards",
      print_current_report_card_only:"Print Current Report Card Only",
      promote:"Promote",
      promotion:"Promotion",
      promotion_status:"Promotion Status",
      pta_fee:"PTA Fee",
      quit:"Exit",
      remark:"Remark",
  		remove:"Remove",
      repeat:"Repeat",
  		residence:"Residence",
  		save_changes:"Save Changes",
  		scheduled_to_teach:"is scheduled to teach",
      school_fee:"School Fee",
      school_statistics:"School Statistics",
  		select_department:"Select Department",
  		select_group:"Select Group",
      select_sex:"Select Gender",
  		select_subject:"Select Subject",
  		select_fee:"Select Fee",
  		select_form:"Select Form",
      select_remark:"Select Remark",
      settings:"Settings", //wrong
  		sex:"Gender",
      signature:"Signature",
      statistics:"Statistics",
  		student:"Student",
  		student_id:"Student ID",
  		student_name:"Student Name",
      student_not_added:"Student Not Added.",
      student_performance:"Student Performance",
      submit:"Submit",
      subject:"Subject",
      subjects:"Subjects",
      subject_name:"Subject Name",
      term:"Term",
      total:"Total",
      type:"Type",
      user_not_found:"User Not Found",
      warning:"Warning",
      weakest_performances:"Weakest Performances",
      withdrawn:"Withdrawn",
  	}, fr:{
      academic:"Scolaire",
  		academic_year:"Année Scolaire",
      access_denied:"Accès Refusé",
  		add:"Ajouter",
  		add_class:"Ajouter la Classe", 
      add_student:"Ajouter l'Étudiant",
      all:"Tous", //wrong
      all_forms:"Tous les Forms", //wrong
      all_terms:"Tous les Termes", 
      all_departments:"Tous les Départements", 
      all_fees:"Tous les Écolages",
      all_groups:"Tous les Groupes",
      annual_results:"Résultats Annuels",
      average:"Moyenne",
      beginning_of_year:"Début de l'Année",
      best_performances:"Meilleures Performances",
  		cancel:"Annuler",
      caps_lock_is_on:"Verr Maj est allumé.",
  		Class:"Classe",
      classmaster:"Professeur Titulaire",
      class_average:"Moyenne de Classe",
      class_name:"Nom de la Classe",
      class_range:"Gamme de Classe",
      clear_all:"Effacer Tous",
  		code:"Code",
      conduct:"Comportement",
      date:"Date",
  		date_of_birth:"Date de Naissance",
      department_name:"Nom du Département",
      dept:"Dept", 
      dismissed:"Exclu",
      edit_student:"Editer l’Étudiant",
      end_of_year:"Fin de l'Année", 
      english:"Anglais",
      enrolled:"Inscrits",
      enrollment:"Inscription",
      enrollment_statistics:"Statitistiques d'Inscription",
      enter_name:"Entrez nom",
      exporting:"Exportation", 
      export_file:"Exporter Vers un Fichier", 
      export_statistics:"Exporter les Statistiques", 
      fail:"Echec",
      fee:"Fee",
      fees:"Les Écolages",
      fee_due:"Écolage",
  		fee_group:"Groupe d’Écolage",
      fee_name:"Nom de l'Écolage",
      female:"Féminin",
      file:"File",
      filter:"Filtre",
      form:"Form", 
      french:"Francais",
  		full_name:"Nom Complet",
      good:"Bien",
      head_of_department:"Chef du Département",
      high:"Elevé", 
      importing:"Importation", 
      import_file:"Importer Fichier",
      incorrect_password:"Mot de Passe Incorrect",
      language:"Langue",
      loading:"Chargement", 
      logout:"Déconnecter", 
      low:"Faible", 
      male:"Masculin",
      move:"Déplacer", 
  		name:"Nom",
      no_remark:"Aucune Remarque",
      number:"Nombre",
      number_enrolled:"Nombre d'Inscrits", 
      number_present: "Nombre Actuel",
      number_with:"Nombre ayant",
  		parent_email:"Email de Parents",
  		parent_name:"Nom de Parents",
  		parent_occupation:"Profession de Parents",
  		parent_phone:"Téléphone de Parents",
      pass:"Réussir",
      passing_score:"Note de Passage",
      password:"Mot de Passe",
      percent_failing:"Pourcentage Echec",
      percent_passing:"Pourcentage Réussir",
      performance_by_subject:"Performances par Sujet",
  		place_of_birth:"Place de Naissance", 
      please_fill_in_all_fields:"Completer tous les sections en rouge et essayer encore.", 
      poor:"Faible",
      possible_factors:"Les Raisons Possibles",
      present:"Actuel",
      print:"Imprimer",
      print_all_report_cards:"Imprimer Tous les Bulletins de Notes", 
      print_current_report_card_only:"Imprimer Juste Un Bulletin de Notes", 
      promote:"Admit",
      promotion:"Promotion",
      promotion_status:"Statut de Promotion",
      pta_fee:"Écolage de PTA", 
      quit:"Fermer",
      remark:"Remarque",
  		remove:"Enlever",
      repeat:"Redouble",
  		residence:"Résidence",
  		save_changes:"Enregistrer les Modifications",
  		scheduled_to_teach:" doit enseigner ",
      school_fee:"Écolage d'École", 
      school_statistics:"Statistiques de l'École", 
  		select_department:"Sélectionner le Départment",
  		select_group:"Sélectionner le Groupe",
  		select_subject:"Sélectionner la Matiére",
  		select_fee:"Sélectionner l’Écolage",
  		select_form:"Sélectionner Form",  //wrong
      select_sex:"Sélectionner Sexe", 
      settings:"Réglages", 
  		sex: "Sexe",
      signature:"Signature",
      statistics:"Statistiques",
  		student:"Étudiant",
  		student_id:"Numéro d'Étudiant",
  		student_name:"Nom de l'Étudiant",
      student_not_added:"Étudiant Pas Ajouté.",
      submit:"Soumettre",
      subject:"Sujet",
      subjects:"Les Sujets",
      subject_name:"Nom du Sujet",
      term:"Terme",
      total:"Total",
      type:"Type",
      user_not_found:"Utilisateur Introuvable",
      warning:"Avertissement",
      weakest_performances:"Dernier Performances",
      withdrawn:"Retiré",
  	},
  }
  self.getDict = function(){
  	console.log("Language is", $routeParams.lang, langDict[$routeParams.lang]);
    if($routeParams.lang){
  	  return langDict[$routeParams.lang];
    } else {
      $routeParams.lang = self.defaultLang;
      return langDict[self.defaultLang];
    }
  }

  return self;

}
Lang.$inject = ['$routeParams'];
angular.module('SchoolMan').service('Lang', Lang);