<?php

namespace BDDObject;

use DB;
use ErrorController as EC;
use SessionController as SC;
use MeekroDBException;

final class Message extends Item
{
	protected static $BDDName = "messages";

	##################################### METHODES STATIQUES #####################################

	protected static function champs()
	{
		return array(
			'idOwner' => array( 'def' => null, 'type' => 'integer'),	// id de l'auteur
			'message' => array( 'def' => "", 'type'=> 'string'),		// contenu du message
			'aUE' => array( 'def' => "", 'type' => 'integer'),	// données relatives au contexte
			'date' => array( 'def' => date('Y-m-d H:i:s'), 'type' => 'dateHeure')	// Date-heure de création
			);
	}

	public static function getList($idUser)
	{
		require_once BDD_CONFIG;
		try {
			// en tant qu'expéditeur
			//$expediteur_bdd_result = DB::query("SELECT m.id, m.idOwner, m.message, m.typeContext, m.dataContext, m.date, GROUP_CONCAT(d.idDest SEPARATOR ';') AS dests, 1 AS lu FROM (".PREFIX_BDD."messages m JOIN ".PREFIX_BDD."destMessages d ON d.idMessage = m.id) WHERE m.idOwner=%i", $idUser);
			$expediteur_bdd_result = DB::query("SELECT m.id, m.idOwner, m.message, m.aUE, m.date, 'Moi' AS ownerName, GROUP_CONCAT(CONCAT(d.idDest,':',u.nom,' ',u.prenom) SEPARATOR ';') AS dests, 1 AS lu FROM ((".PREFIX_BDD."messages m JOIN ".PREFIX_BDD."destMessages d ON d.idMessage = m.id) JOIN ".PREFIX_BDD."users u ON u.id=d.idDest) WHERE m.idOwner=%i GROUP BY m.id", $idUser);
			// en tant que récepteur
			//$recepteur_bdd_result=DB::query("SELECT m.id, m.idOwner, m.message, m.typeContext, m.dataContext, m.date, ".$idUser." AS dests, d.lu FROM (".PREFIX_BDD."messages m JOIN ".PREFIX_BDD."destMessages d ON d.idMessage = m.id) WHERE d.idDest=%i", $idUser);
			$recepteur_bdd_result=DB::query("SELECT m.id, m.idOwner, m.message, m.aUE, m.date, CONCAT(u.prenom, ' ', u.nom) AS ownerName, '".$idUser.":Moi' AS dests, d.lu FROM ((".PREFIX_BDD."messages m JOIN ".PREFIX_BDD."destMessages d ON d.idMessage = m.id) JOIN ".PREFIX_BDD."users u ON u.id=m.idOwner) WHERE d.idDest=%i", $idUser);
		} catch(MeekroDBException $e) {
			EC::addBDDError($e->getMessage(), "Messages/getList");
			return array("error"=>true, "message"=>$e->getMessage());
		}
		$bdd_result = array_merge($expediteur_bdd_result, $recepteur_bdd_result);
		$dates = array_column($bdd_result,"date");
		array_multisort($dates,SORT_ASC,$bdd_result);
		return $bdd_result;
	}

	protected static function getAssocs()
	{
		return array("destMessages" => "idMessage");
	}


	##################################### METHODES #####################################


	protected function okToUpdate($params)
	{
		return false;
	}

	protected function assocsToInsert()
	{
		$dests = explode(";", $this->cibles);
		return array_map($this->mapAssoc, $dests);
	}

	private function mapAssoc($id)
	{
		return array("idDest"=> $id, "idMessage"=>$this->id, "read"=>false);
	}

	public function isOwnedBy($user)
	{
		return $this->values['idOwner'] == $user->getId();
	}
}

?>
