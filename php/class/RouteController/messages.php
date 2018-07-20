<?php

namespace RouteController;
use ErrorController as EC;
use BDDObject\Message;
use BDDObject\AssoDM;
use BDDObject\User;
use BDDObject\Logged;

class messages
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

    public function delete()
    {
        $uLog=Logged::getConnectedUser();
        if (!$uLog->connexionOk())
        {
            EC::set_error_code(401);
            return false;
        }
        elseif ($uLog->isEleve())
        {
            EC::set_error_code(403);
            return false;
        }
        else
        {
            $id = (integer) $this->params['id'];
            $message=Messages::getObject($id);
            if ($message === null)
            {
                EC::set_error_code(404);
                return false;
            }
            elseif($uLog->isAdmin() || $message->isOwnedBy($uLog))
            {
                if ($message->delete())
                    return array( "message" => "Model successfully destroyed!");
            }
            else
            {
                EC::set_error_code(403);
                return false;
            }
        }
        EC::set_error_code(501);
        return false;
    }

    public function insert()
    {
        $uLog=Logged::getConnectedUser();
        if (!$uLog->connexionOk())
        {
            EC::set_error_code(401);
            return false;
        }
        $data = json_decode(file_get_contents("php://input"),true);
        $data["idOwner"] = $uLog->getId();
        $message = new Message($data);
        $id = $message->insertion();
        if ($id!==null) {
            // insertion des des dests liés
            if (isset($data["dests"])){
                $dests = explode(';', $data["dests"]);
                $idOwnerMessage = $id;
                foreach ($dests as $value) {
                    $asso = new AssoDM(array("idDest"=>$value, "idMessage"=>$id, "read"=>false));
                    $asso->insertion();
                }
            } else {
                $dests = "";
            }
            $output = $message->toArray();
            $output["dests"] = $dests;
            $output["read"] = true;
            return $output;
        }
        // Si on en arrive là, erreur
        EC::set_error_code(501);
        return false;
    }

    public function setLu()
    {
        $uLog=Logged::getConnectedUser();
        if (!$uLog->connexionOk())
        {
            EC::set_error_code(401);
            return false;
        }
        $id = (integer) $this->params['id'];
        $setOk = AssoDM::setRead($uLog->getId(),$id);
        if ($setOk === true) {
            return true;
        }
        EC::set_error_code(501);
        return false;
    }





}
?>
