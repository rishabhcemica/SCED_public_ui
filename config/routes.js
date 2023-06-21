/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { controller:'login',
    action: 'index',
    locals: {
      layout: false
    }
  },

  '/attempt': {controller: 'login',
    action: 'attempt',
    locals: {
      layout: false
    }
  },

  '/logout': {controller: 'login',
    action: 'logout',
    locals: {
      layout: false
    }
  },

  '/monitor': {controller: 'monitor',
    action: 'index',
    locals: {
      layout: false
    }
  },

  '/dashboard': { view: 'pages/index' },

  '/gamsopt/getAll':{
    controller:'gamsopt',
    action:'getAll'
  },

/*
  '/exludedgen/putExcludedGen':{

    controller:'excludedgen',
    action:'putExcludedGen'

  },
*/

  '/gen/getAllGens':{
 controller:'gen',
    action:'getallgen'

  },
/*
    '/exclude':{
 controller:'excludedgen',
    action:'excludeview'

  },

  '/atcdetails/putATC':{
     controller:'atcdetails',
     action:'putATC'
  },


'/excludedgen/stopSCED':{
controller:'excludedgen',
     action:'stopSCED'

},

'/excludedgen/startSCED':{
controller:'excludedgen',
     action:'startSCED'

},
*/
'/trends/oands':{
  controller:'gamsdata',
  action:'oands'
},

'/gamsdata/getTodayData':{
  controller:'gamsdata',
  action:'getTodayData'
},
'/gamsdata/getScheduleData':{
  controller:'gamsdata',
  action:'getScheduleData'
},

'/trends/diffschedule':{
    controller:'gamsdata',
  action:'diffs'
},
'/trends/diffoptimals':{
   controller:'gamsdata',
  action:'diffoptimals'
},
'/trends/marginal':{
     controller:'marginalcost',
  action:'marginal'
}
,
'/marginalcost/getTodayCost':{
  controller:'marginalcost',
  action:'getTodayCost'
},
/*
'/excludedgen/getexcludedgen':{

    controller:'excludedgen',
    action:'getExcludedGen'

  },
*/
  '/account/scedaccount':{

    controller:'gamsopt',
    action:'accountView'

  },
  '/gamsopt/accountCost':{

    controller:'gamsopt',
    action:'accountCost'

  },
    '/account/getRates':{

    controller:'GenRates',
    action:'getRates'

  },
  '/GenRates/getHighestCostGen':{
    controller:'GenRates',
    action:'getHighestCostGen'
  },
  '/pages/highestCostGenerators':{
      view:'pages/highestCostGenerators'
  }
,
'/gamsopt/saving':{

    controller:'gamsopt',
    action:'saving'

  },
  '/gamsdata/getTodaySaving':{

    controller:'gamsdata',
    action:'getTodaySaving'

  },

'/gamsdata/cost':{

    controller:'gamsdata',
    action:'costs'

  },
  '/gamsPWC/clamp':{

    controller:'gamspwc',
    action:'clamp'

  },
    '/gamspwc/getGamsClamped':{

    controller:'gamspwc',
    action:'getGamsClamped'

  },
  '/gamsdual/duals':{
    controller:'gamsdual',
    action:'duals'
  },
  '/gamsdual/getDualTrend':{
    controller:'gamsdual',
    action:'getDualTrend'
  }
,
'/gamsopt/accountCostDate':
{

  controller:'gamsopt',
    action:'accountCostDate'
}
,
'/atcdetails/getATC':{
  controller:'atcdetails',
  action:'getATC'
},
'/gamsdata/getTodayDataDate':{
controller:'gamsdata',
action:'getTodayDataDate'

},
'/gamsopt/accountCostDateAll':{
  controller:'gamsopt',
  action:'accountCostDateAll'
},
'/atcdetails/atcir':{
  controller:'atcdetails',
  action:'atcir'
},
'/atcdetails/userAtcTrend':{
controller:'atcdetails',
action:'userAtcTrend'
},
'/GenRates/getramp':{
  controller:'GenRates',
  action:'getRamp'
},
'/Gamspwc/getMillage':{
  controller:'gamspwc',
  action:'getMillage'
},
  '/gamsbuffer/buffers':{
    controller:'gamsbuffer',
    action:'buffers'
  },
  '/gamsbuffer/getBufferTrend':{
    controller:'gamsbuffer',
    action:'getBufferTrend'
  },
  '/gamspwc/report':{
    controller:'gamspwc',
    action:'report'
  },

'/gamspwc/getMillageRange':{
  controller:'gamspwc',
  action:'getMillageRange'
}
,
'/gamspwc/getUtilAvail':{
  controller:'gamspwc',
  action:'getUtilAvail'
},
'/gamspwc/reserves':{
  controller:'gamspwc',
  action:'reserves'
},
'/gamspwc/getReserve':{
  controller:'gamspwc',
  action:'getReserve'
},
'/gamsdata/relaxation':{
  controller:'gamsdata',
  action:'relaxation'
},
'/gamsdata/getRelaxationCost':{
  controller:'gamsdata',
  action:'getRelaxationCost'
},
'/GenRates/getCurtailment':{
  controller:'GenRates',
  action:'getCurtailment'
},
'/gamsimplemented/feedback':{
  controller:'gamsimplemented',
  action:'feedback'
},
'/gamsimplemented/getImplemented':{
  controller:'gamsimplemented',
  action:'getImplemented'
},
'/gamspwc/getChanges':{
  controller:'gamspwc',
  action:'getChanges'
},
'/gamspwc/changes':{
  controller:'gamspwc',
  action:'changes'
},
'/gamspwc/getAveragePrice':{
  controller:'gamspwc',
  action:'getAveragePrice'
},
'/gamspwc/averageprice':{
  controller:'gamspwc',
  action:'averageprice'
},
'/gamsactual/actual':{
  controller:'gamsactual',
  action:'actual'
},
'/gamsactual/getTodayDataActual':{
  controller:'gamsactual',
  action:'getTodayDataActual'
},
'/gamsactual/getTodayDataDateActual':{
  controller:'gamsactual',
  action:'getTodayDataDateActual'
},
'/gamspwc/getChangesSchedule':{
  controller:'gamspwc',
  action:'getChangesSchedule'
},
'/gamspwc/system':{
  controller:'gamspwc',
  action:'system'
},
'/gamspwc/getSystemReport':{
  controller:'gamspwc',
  action:'getSystemReport'
},
'/atcdetails/sendMessage':{
  controller:'atcdetails',
  action:'sendMessage'
},
'/atcdetails/atcirDate':{
  controller:'atcdetails',
  action:'atcirDate'
},
'/atcdetails/irtrend':{
  controller:'atcdetails',
  action:'irtrend'
},
'/gamspwc/getScatterPlot':{
  controller:'gamspwc',
  action:'getScatterPlot'
},
'/gamsbuffer/bufferdata':{
  view:'pages/bufferData'
},
'/gamsbuffer/totalBuffers':{
  controller:'gamsbuffer',
  action:'totalBuffers'
},
'/shiftreport':{
  view:'pages/shiftreport'
},
'/rampanalysis':{
  view:'pages/rampanalysis'
},
'/patternAnalysis':{
  view:'pages/pattern'
},
'/dualAnalysis':{
  view:'pages/dualAnalysis'
},
'/gamsdual/getDualAll':{
  controller:'gamsdual',
  action:'getDualAll'
},
'/durationAnalysis':{
  view:'pages/durationAnalysis'
},
'/pages/DC':{
view:'pages/DC'
},
'/histograms':{
    view:'pages/histograms'
},
'/agc':{
  view:'pages/agcplants'
},
'/gamspwc/scatterplots':{
  view:'pages/scatterplots'
},

'/gamspwc/pricegraphs':{
  view:'pages/pricegraphs'
},
'/pocloss':{
  view:'trends/pocloss'
},
'/gamsdata/getTodayDataDateLoss':{
  controller:'gamsdata',
  action:'getTodayDataDateLoss'
},
'/supplyDemand':{
  view:'trends/supplyDemand'
},
'/gamspwc/getSupplyDemand':{
  controller:'Gamspwc',
  action:'getSupplyDemand'
},
'/gamsbuffer/getOverallBuffer':{
  controller:'gamsbuffer',
  action:'getOverallBuffer'
},
'/detailBuffer':{
  view:'pages/detailBuffer'
},
'/gamspwc/getMCPByDates':{
  controller:'gamspwc',
  action:'getMCPByDates'
},
'/iexmcp/getIEXMCPData':{
  controller:'iexmcp',
  action:'getIEXMCPData'
},

'/trends/MCP-SMP':{
  view:'trends/MCP-SMP'
},
'/trends/MCP':{
  view:'trends/MCP'
},
'/trends/UMCP':{
  view:'trends/UMCP'
},

"/trends/ScatterForPrices":{
  view:'trends/ScatterForPrices'
},

'/dcoffbar/getdcoffbar':
{
  controller:'dcoffbar',
  action:'getdcoffbar'
},
'/dcoffbarreq/getdcoffbarreq':
{
  controller:'dcoffbarreq',
  action:'getdcoffbarreq'
},

'/pages/coldreserve':
{
  view:'pages/coldreserve'
},

'/gamsdata/getpminfromhelper':
{
  controller:'gamsdata',
  action:'getpminfromhelper'
},
'/learning':{
  view:'pages/view/learning'
},
'/spinningreserve':{
  view:'pages/spinningreserve'
},
'/rampingreserve':{
  view:'pages/rampingreserve'
},
'/spincolddiff':{
  view:'pages/spincolddiff'
},
'/rationRampingBySpinning':
{
  view:'pages/rationRampingBySpinning'
},
'/GeneratorsOverview':
{
  view:'pages/GeneratorsOverview'
},
'/gen/getRnaught':{

  view:'trends/rnaught'
},
'/gen/rnaught':{
  controller:'GenController',
  action:'getRnaught'
},
'/report1':{
  view:'trends/report1'
},
'/exclude/getEmerStop':{
  controller:'excludedgen',
  action:'getEmergency'
},

'/exclude/putEmergency':{
   controller:'excludedgen',
  action:'putEmergency'
},

'/exclude/permanentexclude':{
   controller:'excludedgen',
  action:'parmanentExclude'
},
'/atcdetails/atcTrends':{
  controller:'atcdetails',
  action:'atcTrends'
},

'/excludedgen/sced_rras_histapi':{
  controller:'excludedgen',
  action:'sced_rras_ExcludeHist'
},
'/marginalcost/getTodayCostRras':{
  controller:'marginalcost',
  action:'getTodayCostRras'
},
'/marginalCost/smoothSMP':{
  controller:'marginalcost',
  action:'smoothSMP'
},
'/smoothSMP':{
  view:'pages/smoothSMP'
}
,'/rras/punched':{
  controller:'GenController',
  action:'rrasPunchedVal'
},
'/Diagonostic/DiagonosticTable': {
    view: 'Diagonostic/DiagonosticTable'
  },
   '/gen/diagnostics': {
    controller: 'gen',
    action: 'diagnostics'
  },
  '/monthlyreport/getReport':
  {
    controller: 'gamspwc',
    action: 'getReport'
  },
  '/monthreportview':
  {
    view: 'pages/monthlyreport'
  },
  '/atc/getATCIR':{
    controller:'atcdetails',
    action:'getATCIR'

  },
  '/atc/irschtrend':{
    view:'pages/atcirsch'
  },
  '/wbes/getGenSchedule':{
    controller:'wbes',
    action:'getGenSchedule'

  },
  '/wbes/wbesschedule':{
    view:'pages/wbesschedule'
  },
  '/wbes/test':{
    view:'pages/test'
  }
  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
