<?php

namespace RouteController;
use ErrorController as EC;
use BDDObject\Logged;
use BDDObject\AssoUF;
use BDDObject\ExoFiche;
use BDDObject\Note;
use BDDObject\Fiche;

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

    public function profFetch()
    {
        // Renvoie l'ensemble des données pour un prof ou admin, concernant les devoirs
        $uLog =Logged::getConnectedUser();
        if (!$uLog->connexionOk())
        {
            EC::set_error_code(401);
            return false;
        }

        if ($uLog->isProf())
        {
            return array(
                "fiches" => Fiche::getList(array("owner"=> $uLog->getId() )),
                "aUFs" => AssoUF::getList(array("idOwner"=> $uLog->getId() )),
                "aEFs" => ExoFiche::getList(array("idOwner"=>$uLog->getId())),
                "aUEs" => Note::getList(array("idOwner"=>$uLog->getId()))
            );
        } elseif ($uLog->isAdmin()) {
            return array(
                "fiches" => Fiche::getList(),
                "aUFs" => AssoUF::getList(),
                "aEFs" => ExoFiche::getList(),
                "aUEs" => Note::getList(),
                "messages" => EC::messages()
            );
        } else {
            EC::set_error_code(403);
            return false;
        }

        EC::set_error_code(501);
        return false;
    }



}
?>
