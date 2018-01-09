<?php

namespace RouteController;
use ErrorController as EC;
use SessionController as SC;
use BDDObject\User;
use BDDObject\Classe;
use BDDObject\Fiche;
use BDDObject\ExoFiche;
use BDDObject\Note;
use BDDObject\Logged;

class session
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

    public function fetch()
    {
        return $this->getData(null);
    }

    public function delete()
    {
        SC::get()->destroy();
        return $this->getData(null);
    }

    public function insert()
    {
        $data = json_decode(file_get_contents("php://input"),true);

        if (isset($data['identifiant']) && isset($data['pwd']))
        {
            $identifiant=$data['identifiant'];
            $pwd=$data['pwd'];
        }
        else
        {
            EC::set_error_code(501);
            return false;
        }

        $logged = Logged::tryConnexion($identifiant, $pwd);

        if ($logged == null)
        {
            return false;
        }
        else
        {
            return $logged->toArray();
        }
    }

    public function logged()
    {
        $uLog = Logged::getConnectedUser();
        if ($uLog === null) $uLog = Logged::getConnectedUser();
        # On teste seulement si l'utilisateur est connecté
        # sans remettre à jour son time
        return array( "logged"=>$uLog->connexionOk() );
    }


    protected function getData($uLog = null)
    {
        if ($uLog === null) $uLog = Logged::getConnectedUser();
        if ($uLog->connexionOk()) {
            if($uLog->isRoot()) {
                return array(
                    "logged"=>$uLog->toArray(),
                    //"users" => User::getList(array('ranks'=>array(User::RANK_ADMIN, User::RANK_ELEVE, User::RANK_PROF))),
                    //"classes" => Classe::getList(),
                    //"fiches" => Fiche::getList(),
                    "messages"=>EC::messages()
                );
            } elseif ($uLog->isAdmin()) {
                return array(
                    "logged"=>$uLog->toArray(),
                    //"users" => User::getList(array('ranks'=>array(User::RANK_ELEVE, User::RANK_PROF))),
                    //"classes" => Classe::getList(),
                    //"fiches" => Fiche::getList(),
                    "messages"=>EC::messages()
                );
            } elseif ($uLog->isProf()) {
                return array(
                    "logged"=>$uLog->toArray(),
                    //"users" => User::getList(array('classes'=>array_keys( $uLog->ownerOf() ))),
                    //"classes" => Classe::getList(array('ownerIs'=> $uLog->getId() )),
                    //"fiches" => Fiche::getList(array("owner"=> $uLog->getId() )),
                    "messages"=>EC::messages()
                );
            } else {
                return array(
                    "logged"=>$uLog->toArray(),
                    //"users" => array(),
                    //"classes" => Classe::getList(array('forEleve'=> $uLog->getId() )),
                    //"fiches" => Fiche::getList(array("eleve"=> $uLog->getId() )),
                    // Dans le cas d'un élève, on charge d'emblée l'ensemble des notes
                    // et la structure des fiches
                    //"exosfiches" => ExoFiche::getList(array("idUser"=>$uLog->getId())),
                    //"faits" => Note::getList(array("idUser"=>$uLog->getId())),
                    //"fichesAssoc" => $uLog->fichesAssoc(),
                    "messages"=>EC::messages()
                );
            }
        }
        return array(
            "logged"=>$uLog->toArray(),
            "users" => array(),
            "classes" => Classe::getList(array('forJoin'=> true )),
            "fiches" => array(),
            "messages"=>EC::messages()
        );
    }

    protected function reinitMDP()
    {
        $data = json_decode(file_get_contents("php://input"),true);
        if (isset($data['key']))
        {
            $key = $data['key'];
            Logged::tryConnexionOnInitMDP($key);
            $uLog = Logged::getConnectedUser();
            if ($uLog->connexionOk())
            {
                return $data = $this->getData($uLog);
            }
            else
            {
                EC::set_error_code(401);
                return false;
            }
        }
        EC::set_error_code(501);
        return false;
    }







}
?>
