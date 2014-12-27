'use strict';

var request = require('request'),
    fs = require('fs'),
    zlib = require('zlib'),
    mongoose = require('mongoose'),
    Realm = mongoose.model('Realm'),
    Profession = mongoose.model('Profession');

exports.listByLocale = function(req, res, next) {
  var host = req.body.host || 'https://us.api.battle.net/',
      locale = req.body.locale || 'en_US';

  request(host + 'wow/realm/status?locale=' + locale + '&apikey=' + process.env.BNET_ID, function (err, data) {
    if(err) return res.status(500).send(err);

    try {
      var realms = JSON.parse(data.body).realms;
      var cb = function(err, doc) {
        if(err) return res.sendStatus(500);
      };
      for(var i=0; i<realms.length; i+=1) {
        var payload = {
          realm: {
            name: realms[i].name,
            slug: realms[i].slug
          },
          connected_realms: realms[i].connected_realms,
          locale: realms[i].locale,
          updated: new Date().getTime()
        };
        Realm.findOneAndUpdate({'realm.slug': realms[i].slug, 'locale': realms[i].locale}, payload, {upsert: true}, cb);
      }
      res.json(realms);
    } catch(e) {
      res.json({'status': 'error', 'message': e.toString(), 'raw': data});
    }
  });
};

exports.show = function(req, res, next) {
  var realm = req.params.name,
      locale = req.params.locale;

  Realm.findOne({'realm.slug': realm, 'locale': locale}, '-averages -auctions', function (err, realm) {
    if(err) return res.status(500).send(err);

    res.json(realm);
  });
};

exports.downloadAuctionData = function(req, res, next) {
  var host = req.body.host || 'https://us.api.battle.net/',
      locale = req.body.locale || 'en_US',
      realm = req.body.name || 'sargeras',
      outStream = fs.createWriteStream('tmp/' + realm + '_' + locale + '_file.json');
  
  var headers = {
    'accept-encoding': 'gzip,deflate'
  };

  var options = {
    url: host + 'wow/auction/data/' + realm + '?locale=' + locale + '&apikey=' + process.env.BNET_ID,
    headers: headers
  };

  var $req = request(options);

  $req.on('response', function (res) {
    if (res.statusCode !== 200) return;
 
    var encoding = res.headers['content-encoding'];
    if (encoding === 'gzip') {
      res.pipe(zlib.createGunzip()).pipe(outStream);
    } else if (encoding === 'deflate') {
      res.pipe(zlib.createInflate()).pipe(outStream);
    } else {
      res.pipe(outStream);
    }
  });

  $req.on('end', function() {
    console.log('Done');

    fs.readFile('tmp/' + realm + '_' + locale + '_file.json', {encoding: 'utf8'}, function (err, data) {
      if(err) return res.status(500).send(err);
      
      var $data = JSON.parse(data),
          auctionDataFile = $data.files[0].url,
          lastModified = $data.files[0].lastModified;
      
      console.log('Blizzard last modified:', new Date(lastModified));
      console.log('----------------------\n');

      var dumpOutStream = fs.createWriteStream('data/' + realm + '_' + locale + '_auctions.json');
      var dumpOptions = {
        url: auctionDataFile,
        headers: headers
      };

      var dumpReq = request(dumpOptions);

      dumpReq.on('response', function (resp) {
        console.log('Status Code', resp.statusCode);
        if (resp.statusCode !== 200) return res.status(resp.statusCode);
     
        var encoding = resp.headers['content-encoding'];
        if (encoding === 'gzip') {
          resp.pipe(zlib.createGunzip()).pipe(dumpOutStream);
        } else if (encoding === 'deflate') {
          resp.pipe(zlib.createInflate()).pipe(dumpOutStream);
        } else {
          resp.pipe(dumpOutStream);
        }
      });

      dumpReq.on('end', function() {
        fs.unlink('tmp/' + realm + '_' + locale + '_file.json', function (err) {
          if (err) return res.status(500).send(err);
          console.log('Successfully cleaned up ' + realm + ' temp files.');

          Realm.findOneAndUpdate({'realm.slug': realm, 'locale': locale}, {lastModified: lastModified}, {upsert: false}, function (err, doc) {
            if(err) return res.status(500).send(err);

            res.redirect('/realm/' + realm + '/' + locale + '/auctions/professions');
          });
        });        
      });

      dumpReq.on('error', function(err) {
        return res.status(500).send(err);
      });
    });   
  });
 
  $req.on('error', function(err) {
    return res.status(500).send(err);
  });

};

exports.getProfessionsAuctionData = function(req, res, next) {
  var realm      = req.params.name,
      locale     = req.params.locale || 'en_US',
      reagents   = [];

  fs.readFile('data/' + realm + '_' + locale + '_auctions.json', { encoding: 'utf8' }, function (err, data) {
    if(err) res.status(500).send(err);

    try {
      var $data = JSON.parse(data);
    } catch(e) { return res.status(500).send(e.message); }

    Profession.find({}, function (err, professions) {
      if (err) return res.status(500).send(err);
      if (!professions) return res.send(404);

      //loop over professions
      for(var i=0; i<professions.length; i += 1) {
        console.log('Number of reagents for ' + professions[i].name + ': ' + professions[i].reagents.length);

        //loop over reagents in each profession
        for(var n=0; n<professions[i].reagents.length; n += 1) {
          
          if(reagents.indexOf(professions[i].reagents[n].id) === -1) {
            // add to reagents list for future use
            reagents.push(professions[i].reagents[n].id);
          }
      
        }
      
      }

      //console.log('Full list of reagents:');
      //console.log(reagents);

      console.log('\nTotal number of auctions: ' + $data.auctions.auctions.length);

      function isProfessionReagent(element) {
        return reagents.indexOf(element.item) !== -1;
      }

      var filteredAuctions = $data.auctions.auctions.filter(isProfessionReagent);

      console.log('\nTotal number of profession reagent auctions: ' + filteredAuctions.length);

      var payload = {
        canonical_realm: $data.realm,
        auctions: filteredAuctions,
        updated: new Date().getTime()
      };

      Realm.findOneAndUpdate({'realm.slug': realm, 'locale': locale}, payload, {upsert: true}, function (err, doc) {
        if(err) return res.status(500).send(err);

        /*res.json({
          'realm': $data.realm,
          'reagents': {
            'total': reagents.length,
            'list': reagents
          },
          'number_of_auctions': {
            'total': $data.auctions.auctions.length,
            'reagents': filteredAuctions.length
          },
          'updated': payload.updated
        });*/

        fs.unlink('data/' + realm + '_' + locale + '_auctions.json', function (err) {
          if (err) return res.status(500).send(err);
          console.log('Successfully cleaned up ' + realm + ' data files.');

          res.redirect('/realm/' + realm + '/' + locale + '/professions');
        });
      });
    });
  });
};

exports.calculateAvg = function(req, res, next) {
  var realm = req.params.name || 'sargeras',
      locale = req.params.locale || 'en_US';

  function average(arr) {
    var sums = {}, counts = {}, available = {}, results = [], item;
    for (var i = 0; i < arr.length; i += 1) {
        item = arr[i].item;
        if (!(item in sums)) {
            sums[item] = 0;
            counts[item] = 0;
            available[item] = 0;
        }
        sums[item] += Math.round((arr[i].buyout / arr[i].quantity));
        counts[item] += 1;
        available[item] += arr[i].quantity;
    }

    for(item in sums) {
        results.push({ item: parseInt(item), sum: sums[item], auctions: counts[item], cost: Math.round(sums[item] / counts[item]), available: available[item] });
    }
    return results;
  }

  Realm.findOne({'realm.slug': realm, 'locale': locale}, function (err, realm) {
    if(err) return res.sendStatus(500);

    var auctions = JSON.parse(JSON.stringify(realm)).auctions;
    var avg = average(auctions);

    realm.averages = avg;
    realm.save(function(err, updatedRealm) {
      if(err) return res.sendStatus(500);
      res.json(avg);
    });
  });
};

exports.professionCost = function(req, res, next) {
  var realm      = req.params.name || 'sargeras',
      locale     = req.params.locale || 'en_US',
      profession = req.params.professionName;

  Array.prototype.search = function(obj) {
    return this.filter(function(item) {
      for (var prop in obj) {
        if (!(prop in item) || obj[prop] !== item[prop]) {
          return false;
        }
        return true;
      }
    });
  };

  function formatSilverCopper(val){
    while (/(\d+)(\d{2})/.test(val.toString())){
      val = val.toString().replace(/(\d+)(\d{2})/, '$1'+'|'+'$2');
    }
    return val;
  }

  Profession.findOne({'name': profession}, function(err, profession) {
    if(err) return res.sendStatus(500);

    var reagentsList = [];
    for(var i=0; i<profession.reagents.length; i += 1) {
      if(reagentsList.indexOf(profession.reagents[i].id) === -1) {
        reagentsList.push(profession.reagents[i].id);
      }
    }

    Realm.findOne({'realm.slug': realm, 'locale': locale}, 'averages', function (err, realmAverages) {
      if(err) return res.sendStatus(500);
      if(!realmAverages) return res.sendStatus(500);

      var averages = [];

      for(var i=0; i<realmAverages.averages.length; i += 1) {
        if(reagentsList.indexOf(realmAverages.averages[i].item) !== -1) {
          var reagentQty = profession.reagents.search({id:realmAverages.averages[i].item})[0].quantity;
          realmAverages.averages[i].totalCost = (realmAverages.averages[i].cost * parseInt(reagentQty));
          averages.push(realmAverages.averages[i]);
        }
      }

      var totalCost = 0;
      for(var t=0; t<averages.length; t += 1) {
        totalCost += averages[t].totalCost;
      }

      try {
        var silverCopper = formatSilverCopper(totalCost % 10000).split('|');
        res.json({realm: realm, profession: profession, averages: averages, total: totalCost, totalFormatted: Math.round(totalCost / 10000) + 'g ' + silverCopper[0] + 's ' + silverCopper[1] + 'c'});
      } catch(e) {
        res.json({realm: realm, profession: profession, averages: averages, total: totalCost});
      }
    });
  });
};