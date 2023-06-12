<?php 


defined('BASEPATH') OR exit('No direct script access allowed');

class M_home extends CI_Model {

    public function getLokasi()
    {
        $this->db->select('point.id as idpoint, start.nama_marker as name_location, start.location as location_start, end.location as location_end');
        $this->db->from('t_point point');
        $this->db->join('t_marker_start start', 'start.id = point.id_marker_start', 'left');
        $this->db->join('t_marker_end end', 'end.id = point.id_marker_end', 'left');
        $this->db->where('start.status', 1);
        $this->db->where('end.status', 1);
        $this->db->where('point.status', 1);
        return $this->db->get()->result();
    }

}

/* End of file M_home.php */
