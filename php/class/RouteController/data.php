<?php

namespace RouteController;
use ErrorController as EC;
use BDDObject\Logged;
use BDDObject\AssoUF;
use BDDObject\ExoFiche;
use BDDObject\Note;
use BDDObject\Fiche;
use BDDObject\User;
use BDDObject\Exam;

class data
{
    /**
     * paramères de la requète
     * @array
     */
    private $params;
    /**
     * Constructeur
     */
    public function __construct($params)
    {
        $this->params = $params;
    }
    /**
     * renvoie les infos sur l'objet d'identifiant id
     * @return array
     */

    public function eleveFetch()
    {
        // Renvoie l'ensemble des données pour un élève
        $uLog =Logged::getConnectedUser();
        if (!$uLog->connexionOk())
        {
            EC::set_error_code(401);
            return false;
        }

        if ($uLog->isEleve())
        {
            return array(
                "aEFs" => ExoFiche::getList(array("idUser"=>$uLog->getId())),
                "aUFs" => AssoUF::getList(array("idUser"=> $uLog->getId() )),
                "aUEs" => Note::getList(array("idUser"=>$uLog->getId()))
            );
        } else {
            EC::set_error_code(403);
            return false;
        }

        EC::set_error_code(501);
        return false;
    }

    public function fetchMe()
    {
        // Renvoie les données de l'utilisateur connecté
        $uLog =Logged::getConnectedUser();
        if (!$uLog->connexionOk())
        {
            EC::addError("Déconnecté !");
            EC::set_error_code(401);
            return false;
        }
        return $uLog->toArray();
    }

    public function customFetch()
    {
        // Renvoie les données demandées

        $uLog =Logged::getConnectedUser();
        if (!$uLog->connexionOk())
        {
            EC::addError("Déconnecté !");
            EC::set_error_code(401);
            return false;
        }
        $asks = explode("&",$this->params['asks']);

        if ($uLog->isEleve())
        {
            $output = array();
            if (in_array("exofiches", $asks)){
                $output["exofiches"] = ExoFiche::getList(array("idUser"=>$uLog->getId()));
            }

            if (in_array("userfiches", $asks)){
                $output["userfiches"] = AssoUF::getList(array("idUser"=> $uLog->getId() ));
            }

            if (in_array("faits", $asks)){
                $output["faits"] = Note::getList(array("idUser"=>$uLog->getId()));
            }

            return $output;
        }

        if ($uLog->isProf())
        {
            $output = array();
            if (in_array("fiches", $asks)){
                $output["fiches"] = Fiche::getList(array("owner"=> $uLog->getId() ));
            }

            if (in_array("userfiches", $asks)){
                $output["userfiches"] = AssoUF::getList(array("idOwner"=> $uLog->getId() ));
            }

            if (in_array("exofiches", $asks)){
                $output["exofiches"] = ExoFiche::getList(array("idOwner"=>$uLog->getId()));
            }

            if (in_array("faits", $asks)){
                $output["faits"] = Note::getList(array("idOwner"=>$uLog->getId()));
            }

            if (in_array("users", $asks)){
                $output["users"] = User::getList(array('classes'=>array_keys( $uLog->ownerOf() )));
            }

            if (in_array("exams", $asks)){
                $output["exams"] = Exam::getList(array('idOwner'=>$uLog->getId()));
            }

            return $output;

        }

        if ($uLog->isAdmin()) {
            $output = array();
            if (in_array("fiches", $asks)){
                $output["fiches"] = Fiche::getList();
            }

            if (in_array("userfiches", $asks)){
                $output["userfiches"] = AssoUF::getList();
            }

            if (in_array("exofiches", $asks)){
                $output["exofiches"] = ExoFiche::getList();
            }

            if (in_array("faits", $asks)){
                $output["faits"] = Note::getList();
            }

            if (in_array("users", $asks)){
                if ($uLog->isRoot()) $output["users"] = User::getList(array('ranks'=>array(User::RANK_ADMIN, User::RANK_ELEVE, User::RANK_PROF)));
                else $output["users"] = User::getList(array('ranks'=>array(User::RANK_ELEVE, User::RANK_PROF)));
            }

            if (in_array("exams", $asks)){
                $output["exams"] = Exam::getList();
            }

            return $output;

        }

        EC::set_error_code(403);
        return false;
    }



}
?>
