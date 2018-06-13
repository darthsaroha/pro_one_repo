package main

////////////////////////////////
import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/md5"
	"crypto/rand"
	"crypto/sha1"
	"database/sql"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	_ "mysql-master"
	"net/http"
	"os"
	"time"
)

////////////////////////////////
type app struct {
	Db   string
	Port string
}

///////////////////////////////
type board struct {
	Id         string `json:"id"`
	Name       string `json:"name"`
	Desc       string `json:"desc"`
	Tasks      string `json:"tasks"`
	Stats      string `json:"stats"`
	Conf       string `json:"conf"`
	Created_at string `json:"created_at"`
}

///////////////////////////////
type user struct {
	Name            string    `json:"name"`
	Password_digest string    `json:"digest"`
	Email           string    `json:"email"`
	Auth            [3]string `json:"auth"`
	Conf            string    `json:"conf"`
	Created_at      string    `json:"created_at"`
}

func (u *user) genKeys() {
	u.Password_digest = encode(time.Now().String())
	u.Auth[0], _ = encrypt([]byte(u.Auth[0]), []byte(u.Password_digest[:32]))
	u.Auth[1], _ = encrypt([]byte(u.Email), []byte(u.Password_digest[:32]))
	u.Auth[2] = u.Password_digest
}

func (u *user) authAcs(a string, b string) bool {
	if len(b) < 33 || len(a) < 10 {
		return false
	}
	var err error
	if u.Auth[0], err = decrypt(a, []byte(b[:32])); err != nil {
		return false
	}
	return true
}

///////////////////////////////

func main() {
	var a app
	a.Db = os.Getenv("MYSQL_DB")
	a.Port = os.Getenv("PORT")
	if a.Db == "" {
		a.Db = "root:love6226@tcp(localhost:3306)/pr_one_db"
		a.Port = "3000"
	}
	db, _ := sql.Open("mysql", a.Db)
	if db.Ping() != nil {
		log.Fatal("Cannot Connect..")
	}
	mux := http.NewServeMux()
	mux.Handle("/", http.FileServer(http.Dir("static")))

	/////////////////////////////////////////////
	mux.HandleFunc("/user/auth", func(res http.ResponseWriter, req *http.Request) {
		var u user
		defer req.Body.Close()
		if json.NewDecoder(req.Body).Decode(&u) != nil {
			http.Error(res, "INVREQ", 500)
			return
		}
		if err := db.QueryRow("SELECT uid , uname ,uconf, uemail , ucreated_at FROM pr_one_users WHERE uemail = ? AND upassword_digest = ?;", u.Email, encode(u.Password_digest)).Scan(&u.Auth[0], &u.Name, &u.Conf, &u.Email, &u.Created_at); err != nil {
			http.Error(res, "NOREC", 500)
			return
		}
		u.genKeys()
		res.Header().Set("Content-Type", "application/json")
		res.Write([]byte("{\"name\" : \"" + u.Name + "\",\"conf\" : " + u.Conf + ",\"email\" : \"" + u.Email + "\",\"auth\" : [\"" + u.Auth[0] + "\",\"" + u.Auth[1] + "\",\"" + u.Auth[2] + "\"]}"))
	})
	/////////////////////////////////////////////
	mux.HandleFunc("/user/update/conf", func(res http.ResponseWriter, req *http.Request) {
		var u user
		defer req.Body.Close()
		if json.NewDecoder(req.Body).Decode(&u) != nil {
			http.Error(res, "INVREQ", 500)
			return
		}
		if u.authAcs(req.FormValue("auth0"), req.FormValue("auth2")) == false {
			http.Error(res, "NOACS", 500)
			return
		}
		stm, _ := db.Prepare("UPDATE pr_one_users SET uconf = ? ,uupdated_at = ? WHERE uid = ?;")
		defer stm.Close()
		if _, err := stm.Exec(u.Conf, time.Now(), u.Auth[0]); err != nil {
			http.Error(res, "NOUPD", 500)
			return
		}
		res.Header().Set("Content-Type", "application/json")
		res.Write([]byte("{\"status\" : \"Updated\"}"))
	})
	/////////////////////////////////////////////
	mux.HandleFunc("/user/join", func(res http.ResponseWriter, req *http.Request) {
		var u user
		u.Auth[0] = time.Now().String()
		u.Created_at = u.Auth[0]
		defer req.Body.Close()
		if json.NewDecoder(req.Body).Decode(&u) != nil {
			http.Error(res, "INVREQ", 500)
			return
		}
		u.Conf = "{\"cs\": 0}"
		u.Auth[0] = u.Auth[0][2:4] + u.Auth[0][5:7] + u.Auth[0][8:10] + u.Auth[0][17:19] + u.Auth[0][20:22]
		stm, _ := db.Prepare("INSERT INTO pr_one_users (uid,uemail , uname ,uconf, upassword_digest , ucreated_at , uupdated_at) VALUES (? ,? ,?, ?, ?,?,?);")
		defer stm.Close()
		if _, err := stm.Exec(u.Auth[0], u.Email, u.Name, u.Conf, encode(u.Password_digest), time.Now(), time.Now()); err != nil {
			http.Error(res, "NOINS", 500)
			return
		}
		u.genKeys()
		res.Header().Set("Content-Type", "application/json")
		res.Write([]byte("{\"name\" : \"" + u.Name + "\",\"conf\" : " + u.Conf + ",\"email\" : \"" + u.Email + "\",\"auth\" : [\"" + u.Auth[0] + "\",\"" + u.Auth[1] + "\",\"" + u.Auth[2] + "\"]}"))
	})
	/////////////////////////////////////////////
	mux.HandleFunc("/user/boards", func(res http.ResponseWriter, req *http.Request) {
		var u user
		if u.authAcs(req.FormValue("auth0"), req.FormValue("auth2")) == false {
			http.Error(res, "NOACS", 500)
			return
		}
		bds := make([]board, 0)
		var b board
		var bdi string
		rows, err := db.Query("SELECT bid FROM pr_one_usr_bds WHERE uid = " + u.Auth[0] + ";")
		if err != nil {
			http.Error(res, "NOQRY", 500)
			return
		}
		defer rows.Close()
		for rows.Next() {
			rows.Scan(&bdi)
			if err = db.QueryRow("SELECT bid , bname ,bstats, bdesc , bcreated_at FROM pr_one_boards WHERE bid = ?;", bdi).Scan(&b.Id, &b.Name, &b.Stats, &b.Desc, &b.Created_at); err != nil {
				http.Error(res, "NOREC", 500)
				return
			}
			b.Id, _ = encrypt([]byte(b.Id), []byte(req.FormValue("auth2")[:32]))
			b.Tasks = "[]"
			bds = append(bds, b)
		}
		res.Header().Set("Content-Type", "application/json")
		js, _ := json.Marshal(bds)
		res.Write(js)
	})
	////////////////////////////////////////////
	mux.HandleFunc("/user/board/create", func(res http.ResponseWriter, req *http.Request) {
		var b board
		var u user
		defer req.Body.Close()
		if json.NewDecoder(req.Body).Decode(&b) != nil {
			http.Error(res, "INVREQ", 500)
			return
		}
		if u.authAcs(req.FormValue("auth0"), req.FormValue("auth2")) == false {
			http.Error(res, "NOACS", 500)
			return
		}
		b.Created_at = time.Now().String()
		b.Id = b.Created_at[2:4] + b.Created_at[5:7] + b.Created_at[8:10] + b.Created_at[17:19] + b.Created_at[20:22]
		stm, _ := db.Prepare("INSERT INTO pr_one_boards (bid,bname ,bconf,bdesc,btasks,bstats,bcreated_at , bupdated_at) VALUES (?,?,?,? ,? ,?, ?,?);")
		defer stm.Close()
		b.Conf = "{\"cs\": 0}"
		b.Stats = "[2,0,2,0,0]"
		b.Tasks = "[{\"i\": 1,\"n\" : \"Todo\",\"d\" : \"Todo List Description\",\"ts\" : []},{\"i\": 2,\"n\" : \"Complete\",\"d\" : \"Complete List Description\",\"ts\" : []}]"
		if _, err := stm.Exec(b.Id, b.Name, b.Conf, b.Desc, b.Tasks, b.Stats, time.Now(), time.Now()); err != nil {
			http.Error(res, "NOINS", 500)
			return
		}
		go func(id string, bid string) {
			stm, _ := db.Prepare("INSERT INTO pr_one_usr_bds (bid,uid,ubcreated_at) VALUES (?,? ,?);")
			defer stm.Close()
			_, _ = stm.Exec(bid, id, time.Now())
		}(u.Auth[0], b.Id)
		b.Id, _ = encrypt([]byte(b.Id), []byte(req.FormValue("auth2")[:32]))
		res.Header().Set("Content-Type", "application/json")
		js, _ := json.Marshal(b)
		res.Write(js)
	})
	///////////////////////////////////////////
	mux.HandleFunc("/user/board", func(res http.ResponseWriter, req *http.Request) {
		var b board
		var u user
		defer req.Body.Close()
		if u.authAcs(req.FormValue("auth0"), req.FormValue("auth2")) == false {
			http.Error(res, "NOACS", 500)
			return
		}
		b.Id = req.FormValue("bdi")
		bdi, _ := decrypt(b.Id, []byte(req.FormValue("auth2")[:32]))
		if err := db.QueryRow("SELECT bname , bdesc ,bconf,btasks,bstats, bcreated_at FROM pr_one_boards WHERE bid = ?;", bdi).Scan(&b.Name, &b.Desc, &b.Conf, &b.Tasks, &b.Stats, &b.Created_at); err != nil {
			http.Error(res, "NOREC", 500)
			return
		}
		res.Header().Set("Content-Type", "application/json")
		js, _ := json.Marshal(b)
		res.Write(js)
	})
	//////////////////////////////////////////
	mux.HandleFunc("/user/board/update/task", func(res http.ResponseWriter, req *http.Request) {
		var b board
		var u user
		defer req.Body.Close()
		if json.NewDecoder(req.Body).Decode(&b) != nil {
			http.Error(res, "INVREQ", 500)
			return
		}
		if u.authAcs(req.FormValue("auth0"), req.FormValue("auth2")) == false {
			http.Error(res, "NOACS", 500)
			return
		}
		var err error
		b.Id, err = decrypt(b.Id, []byte(req.FormValue("auth2")[:32]))
		if err != nil || b.Tasks == "" {
			http.Error(res, "INVPRM", 500)
			return
		}
		stm, _ := db.Prepare("UPDATE pr_one_boards SET bstats = ? ,btasks = ? , bupdated_at = ? WHERE bid = ?;")
		defer stm.Close()
		if _, err = stm.Exec(b.Stats, b.Tasks, time.Now(), b.Id); err != nil {
			http.Error(res, "NOUPD", 500)
			return
		}
		res.Header().Set("Content-Type", "application/json")
		res.Write([]byte("{\"status\" : \"Updated\"}"))
	})
	/////////////////////////////////////////
	mux.HandleFunc("/user/board/update", func(res http.ResponseWriter, req *http.Request) {
		var b board
		var u user
		defer req.Body.Close()
		if json.NewDecoder(req.Body).Decode(&b) != nil {
			http.Error(res, "INVREQ", 500)
			return
		}
		if u.authAcs(req.FormValue("auth0"), req.FormValue("auth2")) == false {
			http.Error(res, "NOACS", 500)
			return
		}
		var err error
		b.Id, err = decrypt(b.Id, []byte(req.FormValue("auth2")[:32]))
		if err != nil {
			http.Error(res, "INVPRM", 500)
			return
		}
		stm, _ := db.Prepare("UPDATE pr_one_boards SET  bname = ?, bdesc = ?,bconf = ?, bupdated_at = ? WHERE bid = ?;")
		defer stm.Close()
		if _, err = stm.Exec(b.Name, b.Desc, b.Conf, time.Now(), b.Id); err != nil {
			http.Error(res, "NOUPD", 500)
			return
		}
		res.Header().Set("Content-Type", "application/json")
		res.Write([]byte("{\"status\" : \"Updated\"}"))
	})
	////////////////////////////////////////
	mux.HandleFunc("/user/board/delete", func(res http.ResponseWriter, req *http.Request) {
		var u user
		if u.authAcs(req.FormValue("auth0"), req.FormValue("auth2")) == false {
			http.Error(res, "NOACS", 500)
			return
		}
		id, err := decrypt(req.FormValue("bdi"), []byte(req.FormValue("auth2")[:32]))
		if err != nil {
			http.Error(res, "INVPRM", 500)
			return
		}
		stm, _ := db.Prepare("DELETE FROM pr_one_usr_bds WHERE bid = ? AND uid = ?;")
		defer stm.Close()
		if _, err = stm.Exec(id, u.Auth[0]); err != nil {
			http.Error(res, "NODEL", 500)
			return
		}
		go func(id string) {
			stm, _ := db.Prepare("DELETE FROM pr_one_boards WHERE bid = ?;")
			defer stm.Close()
			_, _ = stm.Exec(id)
		}(id)
		res.Header().Set("Content-Type", "application/json")
		res.Write([]byte("{\"status\" : \"Updated\"}"))
	})
	////////////////////////////////////////
	log.Fatal(http.ListenAndServe(":"+a.Port, mux))
}

////////////////////////////////////////////////
func encode(s string) string {
	h := sha1.New()
	h.Write([]byte(s))
	return hex.EncodeToString(h.Sum(nil))
}

///////////////////////////////////////////////////
func getMD5Hash(text string) string {
	hasher := md5.New()
	hasher.Write([]byte(text))
	return hex.EncodeToString(hasher.Sum(nil))
}

///////////////////////////////////////////////////
func encrypt(plaintext []byte, key []byte) (string, error) {
	c, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}
	gcm, err := cipher.NewGCM(c)
	if err != nil {
		return "", err
	}
	nonce := make([]byte, gcm.NonceSize())
	if _, err = io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString([]byte(fmt.Sprintf("%s", gcm.Seal(nonce, nonce, plaintext, nil)))), nil
}

//////////////////////////////////////////////////
func decrypt(inp string, key []byte) (string, error) {
	ciphertext, _ := base64.URLEncoding.DecodeString(inp)
	c, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}
	gcm, err := cipher.NewGCM(c)
	if err != nil {
		return "", err
	}
	nonceSize := gcm.NonceSize()
	if len(ciphertext) < nonceSize {
		return "", errors.New("ciphertext too short")
	}
	nonce, ciphertext := ciphertext[:nonceSize], ciphertext[nonceSize:]
	s, err := gcm.Open(nil, nonce, ciphertext, nil)
	return fmt.Sprintf("%s", s), err
}

////////////////////////////////////
