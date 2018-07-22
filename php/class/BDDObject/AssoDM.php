<?php

namespace BDDObject;

use DB;
use ErrorController as EC;
use SessionController as SC;
use MeekroDBException;

final class AssoDM extends Item
{
	protected static $BDDName = "destMessages";

	##################################### METHODES STATIQUES #####################################

	protected static function champs()
	{
		return array(
			'idDest' => array( 'def' => null, 'type' => 'integer'),	// ids du destinataire
			'idMessage' => array( 'def' => null, 'type' => 'integer'),		// id du message
			'lu' => array( 'def' => false, 'type'=> 'boolean'),		// lu ?
			);
	}

	public static function getFullNames($idList)
	{
		// utile pour construire la réponse lors d'une insertion de message
		require_once BDD_CONFIG;
		try {
			return DB::query("SELECT CONCAT(u.id,':',u.nom,' ',u.prenom) as fullname FROM ".PREFIX_BDD."users u WHERE u.id IN %ls",$idList);
		} catch(MeekroDBException $e) {
			if (BDD_DEBUG_ON) return array('error'=>true, 'message'=>"#User/getList : ".$e->getMessage());
			return array();
		}
	}

	public static function setRead($idDest, $idMessage)
	{
		require_once BDD_CONFIG;
		try{
			DB::update(PREFIX_BDD.'destMessages', array("lu"=>true),"idDest=%i AND idMessage=%i",$idDest, $idMessage);
		} catch(MeekroDBException $e) {
			EC::addBDDError($e->getMessage(), 'Messages/setRead');
			return false;
		}

		if (static::SAVE_IN_SESSION) $session=SC::get()->unsetParam(static::$BDDName);
		EC::add("La modification a bien été effectuée.");
		return true;
	}

	public static function unReadNumber($idUser)
	{
		require_once BDD_CONFIG;
		try{
			DB::query("SELECT id FROM ".PREFIX_BDD.static::$BDDName." WHERE idDest=%i AND lu=0", $idUser);
			return DB::count();
		} catch(MeekroDBException $e) {
			EC::addBDDError($e->getMessage(), 'Messages/unReadNumber');
		}
		return 0;
	}

	##################################### METHODES #####################################


	protected function okToUpdate($params)
	{
		return false;
	}

}

// Il y a un problème sur le getObject qui ne remonte pas tout ce qu'on veut
// Il y a un problème : le setRead devrait renvoyer l'objet message et bien le mettre à jour en cas de sauvegarde session ?

?>
