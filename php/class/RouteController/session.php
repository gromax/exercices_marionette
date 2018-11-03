<?php

namespace RouteController;
use ErrorController as EC;
use SessionController as SC;
use BDDObject\Classe;
use BDDObject\User;
use BDDObject\Logged;
use BDDObject\Message;

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
            return array_merge(
                $logged->toArray(),
                array("unread"=>Message::unReadNumber($logged->getId()) )
            );
            //return $logged->toArray();
        }
    }

    public function sudo()
    {
        $uLog = Logged::getConnectedUser();
        if (!$uLog->isAdmin())
        {
            EC::set_error_code(404);
            return false;
        }
        $id = $this->params["id"];
        $userToConnect = User::getObject($id);
        if ($userToConnect==null)
        {
            EC::set_error_code(404);
            return false;
        }
        if (!$uLog->isStronger($userToConnect))
        {
            EC::set_error_code(403);
            return false;
        }
        $logged = Logged::setUser($userToConnect);
        return array_merge(
            $logged->toArray(),
            array("unread"=>Message::unReadNumber($logged->getId()) )
        );
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
                    "logged"=>array_merge(
                        $uLog->toArray(),
                        array("unread"=>Message::unReadNumber($uLog->getId()) )
                    ),
                    "messages"=>EC::messages()
                );
            } elseif ($uLog->isAdmin()) {
                return array(
                    "logged"=>array_merge(
                        $uLog->toArray(),
                        array("unread"=>Message::unReadNumber($uLog->getId()) )
                    ),
                    "messages"=>EC::messages()
                );
            } elseif ($uLog->isProf()) {
                return array(
                    "logged"=>array_merge(
                        $uLog->toArray(),
                        array("unread"=>Message::unReadNumber($uLog->getId()) )
                    ),
                    "messages"=>EC::messages()
                );
            } else {
                return array(
                    "logged"=>array_merge(
                        $uLog->toArray(),
                        array("unread"=>Message::unReadNumber($uLog->getId()) )
                    ),
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

    public function reinitMDP()
    {
        $key = $this->params["key"];
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
}
?>
